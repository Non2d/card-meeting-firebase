import Card from "./card";
// import { getApp } from "firebase/app";
import { useEffect, useState, useContext } from 'react'
import { getDatabase, onValue, ref } from '@firebase/database'
import { FirebaseError } from '@firebase/util'

import LeftBottom from "../components/left-bottom";
// import CenterTop from "../components/center-top";
import CenterField from "../components/center-card-field";

import { StoreContext } from '../conference/contexts';

const Cards = ({ channelId }: { channelId: string }) => {
    // console.log("Firebase Connected"+JSON.stringify(getApp())); //firebaseが接続されているか確認

    const context = useContext(StoreContext);
    const [cards, setCards] = useState<{ id: number, state: string, content: string }[]>([]);
    const [myMemberId, setMyMemberId] = useState<string>("");
    useEffect(() => {
        try {
            const db = getDatabase()
            const dbRef = ref(db, `/${channelId}/cards`)
            return onValue(dbRef, (snapshot: any) => {
                const cardDatas = snapshot.val()
                if (!cardDatas) {
                    return
                }
                const filteredCardDatas = []
                for (let i = 0; i < cardDatas.length; i++) {
                    if (cardDatas[i]) {
                        filteredCardDatas.push({ "id": i, "state": cardDatas[i].state, "content": cardDatas[i].content })
                    }
                }
                setCards(filteredCardDatas)
            })
        } catch (e) {
            if (e instanceof FirebaseError) {
                console.error(e)
            }
            return
        }
    }, [])

    useEffect(() => {
        const db = getDatabase();
        const dbRef = ref(db, `/${channelId}/members`);
        const unsubscribe = onValue(dbRef, (snapshot: any) => {
            setMyMemberId(context?.room?.member?.id ?? ""); // デフォルト値を設定
        });

        return () => unsubscribe();
    }, [channelId, context?.room?.member?.id]);

    return (
        <>
            <CenterField>
                <div className="flex justify-center items-center gap-4">
                    {cards.map((card) => (
                        card.state === 'Field' && (
                            <Card key={card.id} id={card.id} state={card.state} content={card.content} channelId={channelId} myMemberId={myMemberId} disabled={true} />
                        )
                    ))}
                </div>
            </CenterField>
            <LeftBottom>
                <div className="flex justify-center items-center gap-4">
                    {cards.map((card) => (
                        card.state === myMemberId && (
                            <Card key={card.id} id={card.id} state={card.state} content={card.content} channelId={channelId} myMemberId={myMemberId} />
                        )
                    ))}
                </div>
            </LeftBottom>
        </>
    );
};

export default Cards;