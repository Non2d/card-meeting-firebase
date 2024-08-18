// import { initializeApp } from "firebase/app";
// import { getDatabase, ref, onValue } from "firebase/database";

// const firebaseConfig = {
//   apiKey: "AIzaSyAPiJMyuPP3EvHePzP2CH8x48t7WTHOB2M",
//   authDomain: "card-meeting-firebase.firebaseapp.com",
//   databaseURL: "https://card-meeting-firebase-default-rtdb.asia-southeast1.firebasedatabase.app",
//   projectId: "card-meeting-firebase",
//   storageBucket: "card-meeting-firebase.appspot.com",
//   messagingSenderId: "700011609528",
//   appId: "1:700011609528:web:ae36a39fab7ef565bea34d",
//   measurementId: "G-1PG06DHXSY"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const database = getDatabase(app);

// const firebaseListener = (onNewMessage: (message: string) => void) => {
//   if (typeof onNewMessage !== 'function') { //onNewMessageの形を確認
//     throw new Error('onNewMessage must be a function');
//   }

//   const dataRef = ref(database, '/');
//   onValue(dataRef, (snapshot: any) => {
//     const data = snapshot.val();
//     console.log("Real-time data:", data);
//     onNewMessage(JSON.stringify(data));
//   });
// };

// export default firebaseListener;