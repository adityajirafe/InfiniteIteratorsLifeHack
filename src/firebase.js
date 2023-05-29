// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
import { getAuth } from 'firebase/auth';
// https://firebase.google.com/docs/web/setup#available-libraries

import { getFirestore } from 'firebase/firestore'; // Import Firestore SDK

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyB2elvZW6_WToz223Lb91Iw1tHVxQV_4ds',
  authDomain: 'lifehack-388105.firebaseapp.com',
  projectId: 'lifehack-388105',
  storageBucket: 'lifehack-388105.appspot.com',
  messagingSenderId: '824050908246',
  appId: '1:824050908246:web:5f98d86c8b571b0a380ff7',
  measurementId: 'G-BRVDX9DH2M'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app); // Initialize Firestore
