import { useState, useEffect, useContext } from "react";
import { getDatabase, onValue, ref, get } from '@firebase/database';
import { StoreContext } from '../conference/contexts';

function FavButton({ channelId }: { channelId: string }) {
  const [favNum, setFavNum] = useState(0);
  const [myMemberId, setMyMemberId] = useState<string>("");
  const context = useContext(StoreContext);

  useEffect(() => {
    const db = getDatabase();
    const dbRef = ref(db, `/${channelId}`);
    const unsubscribe = onValue(dbRef, (snapshot: any) => {
      setMyMemberId(context?.room?.member?.id ?? ""); // デフォルト値を設定
    });

    return () => unsubscribe();
  }, [channelId, context?.room?.member?.id]);

  const handleClick = async () => {
    const db = getDatabase();
    const dbRef = ref(db, `/${channelId}/members/${myMemberId}/fav_num`);
    get(dbRef).then((snapshot: any) => {
      if (snapshot.exists()) {
        setFavNum(snapshot.val());
      } else {
        console.log("No data available");
      }
    }).catch((error: any) => {
      console.error(error);
    });

    const API_URL_prefix = process.env.NODE_ENV === "development" ? "http://localhost:7771" : "https://vps4.nkmr.io/card-meet/v1";
    try {
      const response = await fetch(API_URL_prefix + "/rooms/" + channelId + "/" + myMemberId + "/fav_num", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "fav_num": favNum + 1,
        })
      });
    } catch (error) {
      console.error('Fetch error:');
    }
  };

  return (
    <button
      onClick={handleClick}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-20"
    >
      {favNum} 👍
    </button>
  );
}

export default FavButton;
