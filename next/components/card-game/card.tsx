import React from 'react';

const Card = ({ id, content, state, channelId, myMemberId }: any) => {
    const handleClick = async () => {
        console.log(`Card clicked: ${id}`);
        // 他の処理をここに追加
        const API_URL_prefix = process.env.NODE_ENV === "development" ? "http://localhost:7771" : "https://vps4.nkmr.io/card-meet/v1";
        const submitCard = await fetch(API_URL_prefix + "/cards/submit/" + channelId + "/" + id, {
            method: "GET",
            headers: {
                "Content-Type": "application",
            }
        });
    };

    return (
        <div 
            className="border border-gray-300 rounded-lg shadow-lg overflow-hidden my-4 w-48 h-32 transform transition-transform duration-200 hover:scale-105 active:scale-95 flex items-center justify-center"
            onClick={handleClick}
            style={{
                backgroundColor: '#ffffff',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
                cursor: 'pointer'
            }}
        >
            <div className="p-4 text-center">
                <p className="text-lg font-semibold text-gray-800">{content}</p>
            </div>
        </div>
    );
};

export default Card;
