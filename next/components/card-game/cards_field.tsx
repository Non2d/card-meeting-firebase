import React, { useState, useContext } from 'react';
import Card from './card'; // Cardコンポーネントのインポート
import { StoreContext } from '../conference/contexts';

type CardData = {
    id: number;
    state: string;
    content: string;
};

const Cards = () => {
    // const context = useContext(StoreContext);
    // const [messages, setMessages] = useState<CardData[]>([]);
    // const [myMemberId, setMyMemberId] = useState<string | null>(null);

    // const handleNewMessage = (message: string) => {
    //     const parsedMessage = JSON.parse(message); //これがnew_event
    //     const CardDatas = parsedMessage.card_datas;
    //     setMessages(CardDatas);
    //     console.log('New event from server:', parsedMessage);

    //     if (context.room.member) {
    //         setMyMemberId(context.room.member.id);
    //     }
    //     console.log('My Member ID:', myMemberId);
    // };

    // return (
    //     <div>
    //         <div className="flex flex-row gap-4">
    //             {messages.map((message) => (
    //                 message.state === "Field" && (
    //                     <Card key={message.id} id={message.id} context={context} state={message.state} content={message.content} />
    //                 )
    //             ))}
    //         </div>
    //     </div>
    // );
};

export default Cards;