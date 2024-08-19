import { getApp, getApps, initializeApp } from 'firebase/app'

const firebaseConfig = {
  apiKey: "AIzaSyAPiJMyuPP3EvHePzP2CH8x48t7WTHOB2M",
  authDomain: "card-meeting-firebase.firebaseapp.com",
  databaseURL: "https://card-meeting-firebase-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "card-meeting-firebase",
  storageBucket: "card-meeting-firebase.appspot.com",
  messagingSenderId: "700011609528",
  appId: "1:700011609528:web:ae36a39fab7ef565bea34d",
  measurementId: "G-1PG06DHXSY"
};

// Initialize Firebase
export const initializeFirebaseApp = () =>
    getApps().length ? getApp():initializeApp(firebaseConfig);