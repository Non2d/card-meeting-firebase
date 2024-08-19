from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel, Field
from migrate_db import get_db
from logging_config import logger
import random, asyncio

router = APIRouter()

initial_cards = [
    {"state": "Field", "content": "話したい"},
    {"state": "Field", "content": "話したい"},
    {"state": "Field", "content": "話したい"},
    {"state": "Field", "content": "そろそろ他の人も話そう！"},
    {"state": "Field", "content": "みんなはどう思う？"},
    {"state": "Field", "content": "ちょっと待った"},
    {"state": "Field", "content": "整理する時間がほしい"},
    {"state": "Field", "content": "話題を少し変えよう"},
    {"state": "Field", "content": "誰か補足してほしい"},
    {"state": "Field", "content": "音声の調子が悪いかも"}
]

@router.get("/rooms", response_model=str)
async def get_rooms():
    ref = get_db("/")
    return str(ref.get())

# @router.get("/rooms/{channel_id}", response_model=str)
# async def get_room(channel_id: str):
#     ref = get_db(f"/{channel_id}")
#     return str(ref.get())

@router.get("/rooms/{channel_id}", response_model=str)
async def find_or_create_room(channel_id: str):
    # すでに存在する場合は何もしない
    ref = get_db(f"/{channel_id}")
    if ref.get() is not None:
        raise HTTPException(status_code=409, detail=f"Room {channel_id} already exists.") # ここがないと、入室のたびに勝手にカードやメンバーの情報が初期化されてしまう
    else:
        ref_root = get_db("/")
        ref_root.child(channel_id).set({
            'members': {},
            'cards': initial_cards,
        })
        return f"Room {channel_id} created."

class MemberInfo(BaseModel):
    name: str = Field(..., example="John Doe")

@router.post("/rooms/{channel_id}/{member_id}", response_model=str)
async def join_room(channel_id: str, member_id: str, member_info: MemberInfo):
    ref = get_db(f"/{channel_id}")
    if ref.get() is None:
        raise HTTPException(status_code=404, detail=f"Room {channel_id} does not exist.")
    else:
        ref = get_db(f"/{channel_id}/members") # この操作は、membersリストが無くても強行されるので注意！
        ref.child(member_id).set({'name': member_info.name})
        return f"Member {member_id} joined to room {channel_id}."

@router.delete("/rooms/{channel_id}/{member_id}", response_model=str)
async def leave_room_and_auto_redeal(channel_id: str, member_id: str):
    ref = get_db(f"/{channel_id}/members/{member_id}")
    if ref.get() is None:
        raise HTTPException(status_code=404, detail=f"Member {member_id} does not exist in room {channel_id}.")
    else:
        ref.delete()

        # メンバーがいなくなったら即座にランダムに再配布
        cards_ref = get_db(f"/{channel_id}/cards")
        cards = cards_ref.get()
        for card_id, card in enumerate(cards):
            if card is not None and card['state'] == member_id:
                await deal_card(channel_id, card_id)

        return f"Member {member_id} left from room {channel_id}."
    
    

#カード関連のAPI
@router.get("/cards/submit-all/{channel_id}", response_model=str)
async def submit_cards(channel_id: str):
    ref = get_db(f"/{channel_id}")
    if ref.get() is None:
        raise HTTPException(status_code=404, detail=f"Room {channel_id} does not exist.")
    else:
        cards_ref = get_db(f"/{channel_id}/cards")
        cards = cards_ref.get()
        if cards is None:
            raise HTTPException(status_code=404, detail=f"No cards found in room {channel_id}.")
        
        for card_id, card_data in enumerate(cards):
            if card_data is not None:  # Noneチェックを追加
                card_data['state'] = "Field"
                cards_ref.child(str(card_id)).update(card_data)
        
        return f"Force everyone to submit all cards in room {channel_id}."

@router.get("/cards/submit/{channel_id}/{card_id}", response_model=str)
async def submit_card(background_tasks: BackgroundTasks, channel_id: str, card_id: int):
    ref = get_db(f"/{channel_id}")
    if ref.get() is None:
        raise HTTPException(status_code=404, detail=f"Room {channel_id} does not exist.")
    else:
        cards_ref = get_db(f"/{channel_id}/cards")
        cards = cards_ref.get()
        card = cards[card_id]
        
        if card is None:
            raise HTTPException(status_code=404, detail=f"Card {card_id} does not exist in room {channel_id}.")
        
        card['state'] = "Field"
        cards_ref.child(str(card_id)).update(card)
        
        # 5秒後に自動でランダムに1名に配布する
        background_tasks.add_task(auto_redeal, channel_id, card_id, 5)
        
        return f"Submit card {card_id} in room {channel_id}."

async def auto_redeal(channel_id:str, card_id:int, delay:int):
    await asyncio.sleep(delay)
    await deal_card(channel_id, card_id)

@router.get("/cards/deal-all/{channel_id}", response_model=str)
async def deal_cards(channel_id: str):
    ref = get_db(f"/{channel_id}")
    if ref.get() is None:
        raise HTTPException(status_code=404, detail=f"Room {channel_id} does not exist.")
    else:
        members_ref = get_db(f"/{channel_id}/members")
        members = members_ref.get()
        if members is None:
            # await submit_cards(channel_id)
            raise HTTPException(status_code=404, detail=f"No member found in room {channel_id}.")
        filtered_member_ids = [member for member in members if member is not None]
        
        cards_ref = get_db(f"/{channel_id}/cards")
        cards = cards_ref.get()
        if cards is None:
            raise HTTPException(status_code=404, detail=f"No cards found in room {channel_id}, so all cards are set to initial status i.e., Field.")
        
        for card_id, card_data in enumerate(cards):
            if card_data is not None:
                selected_member_id = random.choice(filtered_member_ids)
                card_data['state'] = selected_member_id
                cards_ref.child(str(card_id)).update(card_data)
        return f"Dealt all cards in room {channel_id}."

@router.get("/cards/deal/{channel_id}/{card_id}", response_model=str)
async def deal_card(channel_id: str, card_id: int):
    ref = get_db(f"/{channel_id}")
    if ref.get() is None:
        raise HTTPException(status_code=404, detail=f"Room {channel_id} does not exist.")
    else:
        members_ref = get_db(f"/{channel_id}/members")
        members = members_ref.get()
        if members is None:
            # await submit_card(None, channel_id, card_id)
            raise HTTPException(status_code=404, detail=f"No member found in room {channel_id}, so card is set to initial status i.e., Field.")
        filtered_member_ids = [member for member in members if member is not None]
        
        cards_ref = get_db(f"/{channel_id}/cards")
        cards = cards_ref.get()
        card = cards[card_id]
        
        if card is None:
            raise HTTPException(status_code=404, detail=f"Card {card_id} does not exist in room {channel_id}.")
        
        selected_member_id = random.choice(filtered_member_ids)
        card['state'] = selected_member_id
        cards_ref.child(str(card_id)).update(card)
        
        return f"Dealt card {card_id} to {selected_member_id} in room {channel_id}."