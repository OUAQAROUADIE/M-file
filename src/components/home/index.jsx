import React from 'react'
import { useAuth } from '../../contexts/authContext'
import Sidebar from "../Sidebar";
import Header from "../Header";
import Data from "../Data";
import Data1 from "../Data1"
import "./style.css"
const Home = () => {
    const { currentUser } = useAuth();
    const photoURL = currentUser ? currentUser.photoURL : null;
    return (
        <main>
            <Header photoURL={photoURL} />
            <div className=" d-flex ">
                <Sidebar  className="sidebar" />
                <Data className="data mt-5" />
            </div>
            
        </main>
    );
};


export default Home