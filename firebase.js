//firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const authConfig = {
  apiKey: "AIzaSyB8td07EK5REvHsCWeRqRK-6hEIqKnsnlA",
  authDomain: "pinterestmcg.firebaseapp.com",
  projectId: "pinterestmcg",
  storageBucket: "pinterestmcg.firebasestorage.app",
  messagingSenderId: "184255114625",
  appId: "1:184255114625:web:0d0202b864b4effb5e8c80"
};


const storageConfig = {
  apiKey: 'AIzaSyBvioeuViOLkCDlHYcREIpR3jvS3Hv1a_Y',
  authDomain: 'pintrest-clone-f43f5.firebaseapp.com',
  projectId: 'pintrest-clone-f43f5',
  storageBucket: 'pintrest-clone-f43f5.appspot.com',
  messagingSenderId: '356255996210',
  appId: '1:356255996210:web:b949efaff3d4c62b5e9f2b',
};

const authApp = initializeApp(authConfig, 'auth');
const storageApp = initializeApp(storageConfig, 'storage');

const auth = getAuth(authApp);
const imageDB = getStorage(storageApp);
const firestore = getFirestore(storageApp); 

export { auth, imageDB, firestore };
