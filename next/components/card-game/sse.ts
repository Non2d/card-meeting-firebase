// import { useEffect, useContext } from 'react';

// import { StoreContext } from '../conference/contexts';

// // このコンポーネントはUIを持たない
// const Sse = ({ onNewMessage }: { onNewMessage: (message: string) => void }) => {
//     const store = useContext(StoreContext);
//     useEffect(() => {
//         const API_URL_prefix = process.env.NODE_ENV === "development" ? "http://localhost:8080" : "https://vps4.nkmr.io/card-meet/v1";

//         const memberId = Math.random().toString(36).slice(-8);

//         // console.log("MEMBER ID"+JSON.stringify(store.room.member.id));

//         const eventSource = new EventSource(API_URL_prefix + `/sse-triggered`);

//         eventSource.onmessage = function(event) {
//             onNewMessage(event.data);
//         };

//         // コンポーネントのアンマウント時に接続を閉じる
//         return () => {
//             eventSource.close();
//         };
//     }, [onNewMessage]);

//     return null;
// };

// export default Sse;