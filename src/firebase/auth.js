import { auth } from './firebase';
import "firebase/auth";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    sendEmailVerification,
    updatePassword,
    signInWithPopup,
    updateProfile,
    GoogleAuthProvider,
} from 'firebase/auth';

export const doCreateUserWithEmailAndPassword = async (email, password, username) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: username }); // Mettre à jour le profil avec le nom d'utilisateur
    return userCredential;
};

export const doSignInWithEmailAndPassword = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

export const doSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Ajouter l'utilisateur à Firestore
};

export const doSignOut = () => {
    return auth.signOut();
};

export const doPasswordReset = (email) => {
    return sendPasswordResetEmail(auth, email);
};

export const doPasswordChange = (password) => {
    return updatePassword(auth.currentUser, password);
};

export const doSendEmailVerification = () => {
    return sendEmailVerification(auth.currentUser, {
        url: `${window.location.origin}/home`,
    });
};
