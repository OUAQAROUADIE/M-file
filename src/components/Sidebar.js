import MobileScreenShareIcon from '@material-ui/icons/MobileScreenShare';
import DevicesIcon from '@material-ui/icons/Devices';
import PeopleAltOutlinedIcon from '@material-ui/icons/PeopleAltOutlined';
import QueryBuilderOutlinedIcon from '@material-ui/icons/QueryBuilderOutlined';
import StarBorderOutlinedIcon from '@material-ui/icons/StarBorderOutlined';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import CloudQueueIcon from '@material-ui/icons/CloudQueue';
import styled from 'styled-components';
import {  Menu } from 'antd';
import { Modal } from '@material-ui/core';

import { useEffect, useState } from 'react';
import { getStorage, ref, getDownloadURL,uploadBytes,listAll,getMetadata   } from "firebase/storage";
import { collection, addDoc,serverTimestamp,getFirestore } from "firebase/firestore";
import { LuFileSymlink } from "react-icons/lu";
import { TbFileFilled } from "react-icons/tb";
import {  auth } from "../firebase/firebase";
import { getFilesForUser } from "../common/firebaseApi";
import "./style.css"
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {changeBytes} from "../common/common";
import {PieChartOutlined} from "@material-ui/icons";
import {toast} from "react-toastify";
import {Button} from "react-bootstrap";

import {
    FileFilled,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import SubMenu from "antd/es/menu/SubMenu";

const SidebarContainer = styled.div`
    margin-top: 10px;
`
const SidebarBtn = styled.div`
    button {
        background: transparent;
        border: 1px solid lightgray;
        display: flex;
        align-items: center;
        border-radius: 40px;
        padding:5px 10px;
        box-shadow:2px 2px 2px #ccc;
        margin-left: 20px;
        span {
            font-size: 16px;
            margin-right: 20px;
            margin-left: 10px;
        }
    }
`

const SidebarOptions = styled.div`
    margin-top: 10px;
    .progress_bar {
        padding: 0px 20px;
    }
    .progress_bar span {
        display: block;
        color:#333;
        font-size: 13px;
    }
`

const SidebarOption = styled.div`
    display: flex;
    align-items: center;
    padding: 8px 20px;
    border-radius: 0px 20px 20px 0px;
    &:hover{
        background: whitesmoke;
        cursor: pointer;
    }
    svg.MuiSvgIcon-root {
        color:rgb(78, 78, 78);
    }
    span {
        margin-left: 15px;
        font-size: 13px;
        font-weight: 500;
        color:rgb(78, 78, 78)
    }
`

const ModalPopup = styled.div`
    top: 50%;
    background-color: #fff;
    width: 500px;
    margin: 0px auto;
    position: relative;
    transform: translateY(-50%);
    padding: 10px;
    border-radius: 10px;
`

const ModalHeading = styled.div`
    text-align: center;
    border-bottom: 1px solid lightgray;
    height: 40px;
`

const ModalBody = styled.div`
    input.modal__submit {
        width: 100%;
        background: darkmagenta;
        padding: 10px 20px;
        color: #fff;
        text-transform: uppercase;
        letter-spacing: 5px;
        font-size: 16px;
        border: 0;
        outline: 0;
        border-radius: 5px;
        cursor: pointer;
        margin-top:20px
    }
    input.modal__file {
        background: whitesmoke;
        padding: 20px;
        color: #000;
        display: block;
        margin-top:20px
    }
`

const UploadingPara = styled.p`
    background: green;
    color: #fff;
    margin: 20px;
    text-align: center;
    padding: 10px;
    letter-spacing: 1px;
`

const Sidebar = () => {
    const [open, setOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState(null);
    const currentUser = getAuth().currentUser;
    const [size, setSize] = useState(0);
    const [files, setFiles] = useState([]);
    var storageVal = 0;
    const [storageFile, setStorageFile] = useState(null);
    const [collapsed, setCollapsed] = useState(true);

    const handleFile = e => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    }
    const handleUpload = async (e) => {
        e.preventDefault();
        setUploading(true);

        try {
            const db=getFirestore();
            const storage= getStorage();
            const storageRef = ref(storage, `files/${currentUser.uid}/${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            const url = await getDownloadURL(snapshot.ref);
            const metadata = await getMetadata(snapshot.ref);


            // Check if snapshot.totalBytes is defined, use 0 if not
            // Associate the file with the authenticated user ID
            await addDoc(collection(db, "myfiles"), {
                userId: auth.currentUser.uid,
                timestamp: serverTimestamp(),
                filename: file.name,
                fileURL: url,
                size:metadata.size,
                contentType: metadata.contentType,
                starred: false,
            });

            toast.success("File Uploaded Successfully");
            // Reset state and close modal
            setUploading(false);
            setFile(null);
            setOpen(false);
        } catch (error) {
            console.error("Error uploading file:", error);
            setUploading(false);
            toast.error("Error uploading file. Please try again.");
        }
    };

   /* const handleUpload = async e => {
        e.preventDefault();
        setUploading(true);

        try {
            const storage = getStorage();
            const userStorageRef = ref(storage, `files/${currentUser.uid}/${file.name}`);
            const db = getFirestore();

            await uploadBytes(userStorageRef, file);
                console.log("dd", file)
            const url = await getDownloadURL(userStorageRef);

            await addDoc(collection(db, "myfiles"), {
                timestamp: serverTimestamp(),
                filename: file.name,
                fileURL: url,
                size: file.size,
                userId: currentUser.uid
            });

            setUploading(false);
            setFile(null);
            setOpen(false);

        } catch (error) {
            console.error("Error uploading file:", error);
            setUploading(false);
        }
    };*/

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Subscribe to user's files and update state
                const unsubscribeFiles = await getFilesForUser(user.uid, setFiles);
                for(let file of files){
                    // eslint-disable-next-line react-hooks/exhaustive-deps
                    storageVal += file.data.size;
                    console.log("ss", file.data.contentType) ;
                    console.log("file :",changeBytes(file.data.size));
                }

                // Cleanup the user subscription when the component unmounts
                 //return () => {
                   //unsubscribeFiles();

                 //};
            }
        });


        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (files.length > 0) {
            const sizes = files.reduce((sum, file) => sum + file.data.size, 0);
            console.log("files:", files);
            console.log("sizes:", sizes);

            setSize(sizes);
            console.log("size:", size);
            const  storageSize = changeBytes(sizes);
            console.log("storage:", storageSize);
            setStorageFile(storageSize);
        }
    }, [files]);
    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };


    return (
        <>
         <Modal open={open} onClose={() => setOpen(false)}>
            <ModalPopup>
                <form onSubmit={handleUpload}>
                    <ModalHeading>
                        <h3>Select file you want to upload</h3>
                    </ModalHeading>
                    <ModalBody>
                        {uploading ? <UploadingPara>Uploading...</UploadingPara> : (
                            <>
                                <input type="file" className='modal__file' onChange={handleFile} />
                                <input type="submit" className='modal__submit' />
                            </>
                        )}
                    </ModalBody>
                </form>
            </ModalPopup>
        </Modal>
        <div className="sidebar1">

            <div >
                <Button type="primary" onClick={toggleCollapsed} style={{ marginBottom: 16 }}>
                    {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                </Button>
                <Menu
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub1']}
                    mode="inline"
                    inlineCollapsed={collapsed}
                >
                    <SubMenu key="sub1" icon={<CloudQueueIcon />} title="Storage">
                        <Menu.Item key="2" icon={<PieChartOutlined />}>
                           16 M/15Go
                        </Menu.Item>
                    </SubMenu>
                    <Menu.Item key="3" icon={<LuFileSymlink />} onClick={() => window.location.href="/home"}>
                        MyFile
                    </Menu.Item>
                    <Menu.Item>
                <button onClick={() => setOpen(true)} className="d-flex">
                    <img src="data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2236%22 height=%2236%22 viewBox=%220 0 36 36%22%3E%3Cpath fill=%22%2334A853%22 d=%22M16 16v14h4V20z%22/%3E%3Cpath fill=%22%234285F4%22 d=%22M30 16H20l-4 4h14z%22/%3E%3Cpath fill=%22%23FBBC05%22 d=%22M6 16v4h10l4-4z%22/%3E%3Cpath fill=%22%23EA4335%22 d=%22M20 16V6h-4v14z%22/%3E%3Cpath fill=%22none%22 d=%22M0 0h36v36H0z%22/%3E%3C/svg%3E" />
                    <span className='new'>New</span>
                </button>
                    </Menu.Item>
                </Menu>
               
            </div>

        </div>
        </>
    )
}

export default Sidebar;