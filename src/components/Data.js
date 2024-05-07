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

            await deleteObject(fileRef);

            await deleteDoc(collection(db, "myfiles"), fileId);

            setFiles(files.filter(file => file.id !== fileId));
        } catch (error) {
            console.error("Erreur lors de la suppression du fichier :", error);
        }
    };

    const [showShareIcons, setShowShareIcons] = useState(true);
    const handleOptionsClick = (fileId) => {
        setSelectedFileId(fileId === selectedFileId ? null : fileId);
        setShowShareIcons(false); 
    };
    const handleShareClick = () => {
        setShowShareIcons(!showShareIcons);
    };

    return (
        <DataContainer className="data-container">
            <div>
                <div>
                    <DataListRow>
                        <div><b>Name</b> <ArrowDownwardIcon /> </div>
                        <div><b>Owner</b> </div>
                        <div><b> Delete File</b></div>
                        <div><b>Options</b></div>
                    </DataListRow>
                    {files.map(file => (
                        <DataListRow key={file.id}>
                            <div><b href={file.data.fileURL} target='_blank' rel='noreferrer'><p><InsertDriveFileIcon /> {file.data.filename}</p></b></div>
                            <div><p>{currentUser.displayName} </p></div>
                            <div><p>{file.data.type}</p></div>
                            <div><button><p><DeleteOutlineOutlinedIcon onClick={() => handleDeleteFile(file.id)} /></p></button></div>
                            <div>
                                <OptionsContainer className="optionsContainer" title="Options" onClick={() => handleOptionsClick(file.id)}><SlOptionsVertical /></OptionsContainer>
                                {selectedFileId === file.id && (
                                <div><span onClick={() => {navigator.clipboard.writeText(file.data.fileURL);  toast.success("Link Copied"); }}> <IoCopyOutline className="mt-2" /> </span>
                                    <ShareButton className='shareButton' onClick={handleShareClick}>
                                        <FaShareAlt className="mt-2" />
                                  <span className={showShareIcons ? "show" : ""}>
                                      <EmailShareButton url={file.data.fileURL} subject={`This is ${file.data.filename} file link`}> <EmailIcon size={30} round={true} /> </EmailShareButton>
                                      <FacebookShareButton url={file.data.fileURL} hashtag={file.data.filename}>
                                        <FacebookIcon size={30} round={true} />
                                      </FacebookShareButton>
                                      <LinkedinShareButton
                                          url={file.data.fileURL}
                                          title={`This is ${file.data.filename} file link`}
                                      >
                                        <LinkedinIcon size={30} round={true} />
                                      </LinkedinShareButton>
                                      <WhatsappShareButton
                                          url={file.data.fileURL}
                                          title={`This is ${file.data.filename} file link`}
                                      >
                                        <WhatsappIcon size={30} round={true} />
                                      </WhatsappShareButton>

                                  </span>

                                    </ShareButton>
                                </div>
                                )}
                            </div>
                        </DataListRow>
                    ))}
                </div>
            </div>
        </DataContainer>

);
};

export default Data;
