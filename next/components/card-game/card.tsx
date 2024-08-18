import React, { useEffect, useState } from 'react';

interface CardProps {
    id: number;
    context: any;
    content: string;
    state: string;
    onClick?: () => void;
}

const Card = ({ id, context, content, state, onClick }: CardProps) => {
    const handleClick = async () => {
        console.log(`channel id: ${context.room.id}, member id: ${context.room.member.id}`);
    };

    return (
        <div 
            className="border border-gray-300 rounded-lg shadow-lg overflow-hidden my-4 w-48"
            onClick={handleClick}
        >
            <div className="p-4">
                <p className="text-sm text-gray-500">State: {state}</p>
                <p>{content}</p>
            </div>
        </div>
    );
};

export default Card;