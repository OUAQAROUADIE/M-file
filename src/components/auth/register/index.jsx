import React, { useState } from 'react'
import { Navigate, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/authContext'
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { doCreateUserWithEmailAndPassword } from "../../../firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import {Container, Nav, Navbar} from "react-bootstrap";

const Register = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [photo, setPhoto] = useState(null); 

    const db = getFirestore();
    const storage = getStorage();

    const { userLoggedIn } = useAuth();

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!isRegistering) {
            setIsRegistering(true);
            try {
                const userCredential = await doCreateUserWithEmailAndPassword(email, password, displayName);
                let photoUrl = ''; 
                if (photo) {
                    const photoRef = ref(storage, `profile_photos/${userCredential.user.uid}`);
                    await uploadBytes(photoRef, photo);
                    photoUrl = await getDownloadURL(photoRef); 
                }
                
                await addDoc(collection(db, "users"), {
                    uid: userCredential.user.uid,
                    email: userCredential.user.email,
                    displayName: userCredential.user.displayName,
                    photoUrl: photoUrl
                });

                navigate('/home');
            } catch (error) {
                // Gérer les erreurs
                setErrorMessage(error.message);
                setIsRegistering(false);
            }
        }
    };

    const handlePhotoChange = (e) => {
        if (e.target.files[0]) {
            setPhoto(e.target.files[0]);
        }
    };

    return (
        <>
            <Navbar bg="light" expand="lg">
                <Container>
                    <img src="./logo.png" className="logo"/>
                    <Navbar.Brand href="." >M-File</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">.
                        <Nav className="ml-auto">
                            <button type="button" className="btn btn1 btn-success" onClick={() => window.location.href="/login"}>Connexion</button>
                            <button type="button" className="btn btn1 btn-success"onClick={() => window.location.href="/register"} >Inscription</button>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            {userLoggedIn && (<Navigate to={'/home'} replace={true} />)}
            <main className="w-full h-screen flex self-center place-content-center place-items-center">
                <div className="w-96 text-gray-600 space-y-5 p-4 shadow-xl border rounded-xl">
                    <div className="text-center mb-6">
                        <div className="mt-2">
                            <h3 className="text-gray-800 text-xl font-semibold sm:text-2xl">Create a New Account</h3>
                        </div>
                    </div>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div>
                            <label className="text-sm text-gray-600 font-bold">Email</label>
                            <input
                                type="email"
                                autoComplete='email'
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:indigo-600 shadow-sm rounded-lg transition duration-300"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-600 font-bold">Username</label>
                            <input
                                type="name"
                                required
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:indigo-600 shadow-sm rounded-lg transition duration-300"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-600 font-bold">Password</label>
                            <input
                                disabled={isRegistering}
                                type="password"
                                autoComplete='new-password'
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-600 font-bold">Confirm Password</label>
                            <input
                                disabled={isRegistering}
                                type="password"
                                autoComplete='off'
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-600 font-bold">Upload Photo</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoChange}
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                            />
                        </div>

                        {errorMessage && (
                            <span className='text-red-600 font-bold'>{errorMessage}</span>
                        )}

                        <button
                            type="submit"
                            disabled={isRegistering}
                            className={`w-full px-4 py-2 text-white font-medium rounded-lg ${isRegistering ? 'bg-gray-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl transition duration-300'}`}
                        >
                            {isRegistering ? 'Signing Up...' : 'Sign Up'}
                        </button>
                        <div className="text-sm text-center">
                            Already have an account? {'   '}
                            <Link to={'/login'} className="text-center text-sm hover:underline font-bold">Continue</Link>
                        </div>
                    </form>
                </div>
            </main>
        </>
    )
}

export default Register;
