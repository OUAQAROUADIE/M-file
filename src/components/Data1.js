import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ListIcon from '@material-ui/icons/List';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { collection, getFirestore, getDocs, deleteDoc } from "firebase/firestore"; // Import de deleteDoc pour supprimer un document Firestore
import firebase from 'firebase/app';
import { getAuth } from "firebase/auth";
import { getStorage, ref, listAll, getDownloadURL, deleteObject } from "firebase/storage";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';

import {FaShareAlt} from "react-icons/fa"; // Import de deleteObject pour supprimer un fichier de stockage
import {
    EmailShareButton,
    FacebookShareButton,
    LinkedinShareButton,
    WhatsappShareButton,
    EmailIcon,
    FacebookIcon,
    LinkedinIcon,
    WhatsappIcon,
} from "react-share";
import {SlOptionsVertical} from "react-icons/sl";
import { toast } from "react-toastify";
import {IoCopyOutline} from "react-icons/io5";
import {changeBytes, convertDates} from "../common/common";

const DataContainer = styled.div`
  flex: 1 1;
  padding: 10px 0px 0px 20px;
`;
const OptionsContainer = styled.span`
  cursor: pointer;
`;

const DataListRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #ccc;
  padding: 10px;
  p {
    display: flex;
    align-items: center;
    font-size: 13px;
    b {
      display: flex;
      align-items: center;
    }
    svg {
      font-size: 22px;
      margin:10px;
    }
  }
`;



const OptionsMenu = styled.span`
  display: flex;
  align-items: center;
  flex-direction: column;
  position: absolute;
  background-color: #fff;
  border: 2px solid #ccc;
  top: -200%;
  right: 100%;
  cursor: pointer;
  z-index: 10;
  width: max-content;
  min-width: 120px;
  border-radius: 10px;
  &::before {
    content: "";
    position: absolute;
    width: 15px;
    height: 15px;
    background-color: #fff;
    top: 100px;
    right: -8px;
    transform: rotate(45deg);
    border-right: 1px solid #ccc;
    border-top: 1px solid #ccc;
  }

  span {
    width: 100%;
    border-bottom: 2px solid #ccc;
    padding: 10px;
    display: flex;
    align-items: center;

    a {
      color: #000;
    }
    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background-color: #ccc;
      z-index: 11;
    }
  }

  button {
    background-color: transparent;
    border: none;
    color: red;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  a {
    color: #000;
    background-color: transparent;
  }

  .fileSize,
  .uploaded {
    background-color: #f0f0f0;
    cursor: default;
  }

` ;


const ShareButton = styled.span`
  position: relative;
  cursor: pointer;

  span {
    width: max-content;
    height: max-content;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 0;
    position: absolute;
    top: -80px;
    left: -60px;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease-in-out;
  }

  .show {
    opacity: 1;
    visibility: visible;
  }

  &:hover {
    span {
      background-color: transparent;
    }
  }
`;

const Data = ({

                  }) => {
    const currentUser = getAuth().currentUser;
    const [files, setFiles] = useState([]);
    const db = getFirestore();
    const storage = getStorage();
    const [selectedFileId, setSelectedFileId] = useState(null);


    useEffect(() => {
        const fetchData = async () => {
            if (currentUser) {
                const userStorageRef = ref(storage, `files/${currentUser.uid}`);

                listAll(userStorageRef)
                    .then((res) => {
                        const promises = res.items.map((itemRef) => getDownloadURL(itemRef));
                        Promise.all(promises)
                            .then((urls) => {
                                const filesData = res.items.map((itemRef, index) => ({
                                    id: itemRef.name,
                                    data: {
                                        filename: itemRef.name,
                                        fileURL: urls[index],
                                        size:itemRef.storage,

                                    }
                                }));
                                setFiles(filesData);
                            })
                            .catch((error) => {
                                console.error("Error fetching download URLs:", error);
                            });
                    })
                    .catch((error) => {
                        console.error("Error fetching files:", error);
                    });
            }
        };
        fetchData();
    }, [currentUser, storage]);

    const handleDeleteFile = async (fileId) => {
        try {
            const db = getFirestore();
            const storage = getStorage();
            const fileRef = ref(storage, `files/${currentUser.uid}/${fileId}`);

            // Supprimer le fichier du stockage
            await deleteObject(fileRef);

            // Supprimer l'entrée du fichier de Firestore
            await deleteDoc(collection(db, "myfiles"), fileId);

            // Mettre à jour l'état des fichiers pour refléter les changements
            setFiles(files.filter(file => file.id !== fileId));
        } catch (error) {
            console.error("Erreur lors de la suppression du fichier :", error);
        }
    };

    const [showShareIcons, setShowShareIcons] = useState(true);
    const handleOptionsClick = (fileId) => {
        setSelectedFileId(fileId === selectedFileId ? null : fileId);
        setShowShareIcons(false); // Fermer les icônes de partage
    };
    const handleShareClick = () => {
        setShowShareIcons(!showShareIcons);
    };
                  }
export default function App() {
    return (
        <MDBTable striped className='mt-5' >
            <MDBTableHead>
                <tr>
                    <th scope='col'>#</th>
                    <th scope='col'>First</th>
                    <th scope='col'>Last</th>
                    <th scope='col'>Handle</th>
                </tr>
            </MDBTableHead>
            <MDBTableBody>
                <tr>
                    <th scope='row'>1</th>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                </tr>
                <tr>
                    <th scope='row'>2</th>
                    <td>Jacob</td>
                    <td>Thornton</td>
                    <td>@fat</td>
                </tr>
                <tr>
                    <th scope='row'>3</th>
                    <td colSpan={2}>Larry the Bird</td>
                    <td>@twitter</td>
                </tr>
            </MDBTableBody>
        </MDBTable>
    );
}