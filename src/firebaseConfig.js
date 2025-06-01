// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBQtggV_PHwtFmZenHUQ1QcFinnbDPIh5Q",
    authDomain: "flowtrack-e2c0d.firebaseapp.com",
    projectId: "flowtrack-e2c0d",
    storageBucket: "flowtrack-e2c0d.firebasestorage.app",
    messagingSenderId: "811650204820",
    appId: "1:811650204820:web:5573c4329c8a2b26dc2081"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const signUp = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("User signed up:", userCredential.user);
        return userCredential.user;
    } catch (error) {
        console.error("Signup error:", error.message);
        return null;
    }
};

// Login Function
export const login = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("User logged in:", userCredential.user);
        return userCredential.user;
    } catch (error) {
        console.error("Login error:", error.message);
        return null;
    }
};

// Logout Function
export const logout = async () => {
    try {
        await signOut(auth);
        console.log("User logged out");
    } catch (error) {
        console.error("Logout error:", error.message);
    }
};