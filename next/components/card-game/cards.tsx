import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
import { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../conference/contexts'; // Assuming StoreContext is defined in this path

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
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const firebaseListener = (channel_id:string, onNewMessage: (message: string) => void) => {
  if (typeof onNewMessage !== 'function') {
    throw new Error('onNewMessage must be a function');
  }

  const dataRef = ref(database, '/'+channel_id);
  onValue(dataRef, (snapshot: any) => {
    const data = snapshot.val();
    onNewMessage(JSON.stringify(data));
  });
};

type CardData = {
    id: number;
    state: string;
    content: string;
};

const Cards = () => {
    const context = useContext(StoreContext);
    const [myMemberId, setMyMemberId] = useState<string | null>(null);

    useEffect(() => {
        if (context.room.member){
            setMyMemberId(context.room.member.id);
        }

        firebaseListener(context.room.id, (message: string) => {
            console.log("New Event" + context.room.id);
            console.log("New Event from firebase:", message);
            const parsedMessage = JSON.parse(message);
            const room = parsedMessage[context.room.id];
            console.log("New Event" + room);
        });
    }, [context.room]);

    return (
        <div>
            {/* <div className="flex flex-row gap-4">
                {messages.map((message) => (
                    message !== myMemberId && (
                        <Card key={message} id={message} context={context} state={message} content={message} />
                    )
                ))}
            </div> */}
        </div>
    );
};

export default Cards;