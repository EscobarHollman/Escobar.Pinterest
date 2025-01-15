
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBvioeuViOLkCDlHYcREIpR3jvS3Hv1a_Y',
  authDomain: 'pintrest-clone-f43f5.firebaseapp.com',
  projectId: 'pintrest-clone-f43f5',
  storageBucket: 'pintrest-clone-f43f5.appspot.com',
  messagingSenderId: '356255996210',
  appId: '1:356255996210:web:b949efaff3d4c62b5e9f2b',
};


const firebase = initializeApp(firebaseConfig);
const auth = getAuth(firebase);
const imageDB = getStorage(firebase);
const firestore = getFirestore(firebase);
export { auth, imageDB, firestore, firebase };
