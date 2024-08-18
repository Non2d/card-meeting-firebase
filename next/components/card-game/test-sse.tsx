// import { useEffect, useState } from 'react';

// const SSETestComponent = () => {
//     const [messages, setMessages] = useState<string[]>([]);

//     useEffect(() => {
//         const API_URL_prefix = process.env.NODE_ENV === "development" ? "http://localhost:8080" : "https://vps4.nkmr.io/card-meet/v1";
        
//         const eventSource = new EventSource(API_URL_prefix + '/sse-triggered');

//         eventSource.onmessage = function(event) {
//             setMessages(prevMessages => [...prevMessages, event.data]);
//             // console.log('New event from server:', event.data);
//         };

//         // コンポーネントのアンマウント時に接続を閉じる
//         return () => {
//             eventSource.close();
//         };
//     }, []);

//     // 最新の2-3件のメッセージを取得
//     const recentMessages = messages.slice(-3);

//     return (
//         <div>
//             <h1>Received Messages</h1>
//             <div>
//                 {recentMessages.map((msg, index) => (
//                     <div key={index}>
//                         <p>{msg}</p>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default SSETestComponent;