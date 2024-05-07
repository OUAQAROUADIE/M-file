import React, { useState } from 'react';
import { useAuth } from '../../contexts/authContext';
import {
    updateProfile,
    updateEmail,
    updatePhoneNumber,
    getAuth,
    PhoneAuthProvider,
    sendEmailVerification
} from 'firebase/auth';

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import Header from "../Header";
import { auth, storage } from '../../firebase/firebase';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from "../Sidebar";

const Profile = () => {
    const { currentUser } = useAuth();
    const [newUsername, setNewUsername] = useState('');
    const [newProfilePic, setNewProfilePic] = useState(null);
    const [newPhoneNumber, setNewPhoneNumber] = useState('');
    const [newEmail, setNewEmail] = useState(''); 
    const [verificationId, setVerificationId] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const auth2 = getAuth();

    const handleProfileUpdate = async () => {
        try {
            if (newUsername.trim() !== '') {
                await updateProfile(auth2.currentUser, {
                    displayName: newUsername
                });
                setSuccess('Username updated successfully!');
            }

            if (newProfilePic) {
                const storageRef = ref(storage, `profile_pictures/${currentUser.uid}/${newProfilePic.name}`);
                const snapshot = await uploadBytes(storageRef, newProfilePic);
                const picURL = await getDownloadURL(snapshot.ref);

                await updateProfile(auth2.currentUser, {
                    photoURL: picURL
                });
                setSuccess('Profile picture updated successfully!');
            }

            if (newPhoneNumber.trim() !== '') {
                const provider = new PhoneAuthProvider(auth2);
                const verificationId = await provider.verifyPhoneNumber(
                    newPhoneNumber,
                );
                setVerificationId(verificationId);
                setSuccess('Verification code sent to the new phone number!');
            }
        } catch (error) {
            setError('Error updating profile: ' + error.message);
        }
    };


    const handleEmailUpdate = async () => {
        try {
            if (!currentUser.emailVerified) {
                await sendEmailVerification(auth.currentUser);
                setSuccess('Verification email sent to the new email address. Please verify before updating.');
                return;
            }

            await updateEmail(auth.currentUser, newEmail);
            setSuccess('Email updated successfully!');
        } catch (error) {
            setError('Error updating email: ' + error.message);
        }
    };

    return (
        <>
            <Header />
            <div className="d-flex">
            <Sidebar />
            <Container className="mt-5">
                <Row className="justify-content-center">
                    <Col md={8}>
                        <Card>
                            <Card.Body>
                                <h1 className="mb-4">User Profile</h1>
                                <Row>
                                    <Col md={4}>
                                        <div className="text-center">
                                            <img src={auth2.currentUser.photoURL} className="card-img-top" alt="User Avatar" />
                                            <h5 className="mt-3">{currentUser.displayName}</h5>
                                            <p className="card-text">{currentUser.email}</p>
                                        </div>
                                    </Col>
                                    <Col md={8}>
                                        <h5 className="mb-4">Update Profile</h5>
                                        <Form>
                                            <Form.Group className="mb-3">
                                                <Form.Control  type="text"  placeholder="Enter new username"   value={newUsername}   onChange={(e) => setNewUsername(e.target.value)} />
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Control   type="file"   accept="image/*" onChange={(e) => setNewProfilePic(e.target.files[0])} />
                                            </Form.Group>
                                            <Form>
                                                <Form.Group className="mb-3">
                                                    <Form.Control type="email" placeholder="Enter new email" value={newEmail}  onChange={(e) => setNewEmail(e.target.value)}/></Form.Group>
                                            </Form>
                                            <Button variant="primary" onClick={handleEmailUpdate}>Update Email</Button>
                                            <Button variant="primary me-2" className='ml-2' onClick={handleProfileUpdate}>Update Profile</Button>
                                        </Form>
                                        {error && <div className="text-danger mt-3">{error}</div>}
                                        {success && <div className="text-success mt-3">{success}</div>}
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
            </div>
        </>
    );
};

export default Profile;
