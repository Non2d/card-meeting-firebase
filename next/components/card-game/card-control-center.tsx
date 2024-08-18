import React, { useContext } from 'react';
import { IconButton } from "../../components/components/icon";
import { StoreContext } from '../conference/contexts';

const CardControlCenter = () => {
    const context = useContext(StoreContext);

    const handleDealCards = async () => {
        console.log('Cards dealt:' + context.room.id);
        const API_URL_prefix = process.env.NODE_ENV === "development" ? "http://localhost:7770" : "https://vps4.nkmr.io/card-meet/v1";
        const dealCards = await fetch(API_URL_prefix + "/deal-all/" + context.room.id, {
            method: "GET",
            headers: {
                "Content-Type": "application",
            }
        });
    };

    return (
        <div>
            <IconButton
                name="deal_cards"
                title="Deal cards"
                onClick={handleDealCards}
            />
        </div>
    );
};

export default CardControlCenter;