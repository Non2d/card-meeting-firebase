import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCQzjo3nnA6dCmnKga9J_DLCLImwdo97s0",
  authDomain: "card-game-db-db944.firebaseapp.com",
  databaseURL: "https://card-game-db-db944-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "card-game-db-db944",
  storageBucket: "card-game-db-db944.appspot.com",
  messagingSenderId: "1034499730169",
  appId: "1:1034499730169:web:4083b9b36401997b5b5028"
};

// Initialize Firebase
export const initializeFirebaseApp = () => {
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  const auth = getAuth(app);

  signInAnonymously(auth)
    .then(() => {
      console.log('Signed in anonymously');
      // Additional logic after successful sign-in...
    })
    .catch((error: any) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(`Error during anonymous sign-in: ${errorCode} - ${errorMessage}`);
      // Additional error handling...
    });

  return app;
};
