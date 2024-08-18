from typing import List
import schemas.room as room_schema #import api.schemas.roomだとエラーになる

from fastapi import APIRouter, Depends, Request, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.responses import StreamingResponse
import time, json, uuid, jwt, os, httpx
from dotenv import load_dotenv
from queue import Queue
from threading import Thread
from collections import defaultdict
from datetime import datetime  # datetimeモジュールをインポート。テスト用
import asyncio
# from cruds.room import queue_card_datas

from logging_config import logger

import cruds.room as room_crud
from db import get_db

import random

router = APIRouter()

@router.get("/rooms", response_model=List[room_schema.Room])
async def list_rooms(db: AsyncSession = Depends(get_db)):
    rooms = await room_crud.get_rooms(db)
    return rooms

@router.get("/rooms/{channel_id}", response_model=room_schema.Room)
async def get_room(channel_id: str, db: AsyncSession = Depends(get_db)):
    room = await room_crud.get_room_by_channel_id(db, channel_id)
    return room

@router.post("/rooms", response_model=room_schema.RoomCreateResponse)
async def create_room(
    room_body: room_schema.RoomCreate, db: AsyncSession = Depends(get_db)
):
    return await room_crud.create_room(db, room_body)
# awaitを忘れると，文法は問題ないがroom_crud.create_room(db, room_body) の応答を待たずにレスポンスを返してしまい，エラーになる

@router.get("/rooms/members/{channel_id}", response_model=List[room_schema.Member])
async def get_members(channel_id: str, db: AsyncSession = Depends(get_db)):
    members = await room_crud.get_members(db, channel_id)
    return members

@router.post("/rooms/members/{channel_id}", response_model=room_schema.MemberCreateResponse)
async def add_member(new_member:room_schema.MemberCreate, channel_id:str, db: AsyncSession = Depends(get_db)):
    results = await room_crud.create_member(db, channel_id, new_member)
    queues_to_update = list(client_queues.values())

    for queue in queues_to_update:
        response = await room_crud.get_rooms(db)
        # Collect card data from each room
        card_datas = []
        for room in response:
            for card in room.cards:
                card_datas.append({"state": card.state, "content": card.content})
        
        new_event = {"tag": "update", "card_datas": card_datas}
        queue.put(new_event)
    
    return results

@router.delete("/rooms/members/{channel_id}/{member_id}")
async def delete_member(channel_id:str, member_id:str, db: AsyncSession = Depends(get_db)):
    return await room_crud.delete_member(db, channel_id, member_id)

@router.get("/deal-all/{channel_id}")
async def deal_cards(channel_id:str, db: AsyncSession = Depends(get_db)):
    room = await room_crud.get_room_by_channel_id(db, channel_id)  # 部屋情報を取得

    # DBを更新
    for db_card in room.cards: # 操作対象としての取得 = db_card
        random_member = random.choice(room.members) #配布先のmemberをランダムに選択
        dst_member_id = random_member.member_id
        db_card.state = dst_member_id
    await db.commit()
    await db.refresh(room)

    # 更新されたDBデータ(room.cards...)をQueueに追加
    card_datas = []
    for card in room.cards: # 単なるデータとしての取得 = card. ちなみにdb.refleshが反映されている...はず
        card_datas.append({"id": card.id, "state": card.state, "content": card.content}) #ここでdst_member_idを直接入れちゃダメ。あくまでDBから取得！

    new_event = {"tag": "update", "card_datas": card_datas}

    # 各キューに対して同じ new_event を追加
    # 全てのクライアントに同じイベントを配信する！
    # データ秘匿のために一部隠す、とかは今後やるけど、>>一貫性<<が必須なので注意！(キーが同じなら必ず同じ値かnullを返す、など)
    queues_to_update = list(client_queues.values())
    for queue in queues_to_update:
        queue.put(new_event)

    return {"message": "Cards dealt"}

@router.get("/deal/{channel_id}/{card_id}")
async def deal_card(channel_id:str, card_id:int, db: AsyncSession = Depends(get_db)):
    room = await room_crud.get_room_by_channel_id(db, channel_id)

    # DBを更新
    random_member = random.choice(room.members) #再配布先はランダムに決定
    dst_member_id = random_member.member_id
    for db_card in room.cards:
        if db_card.id == card_id:
            db_card.state = dst_member_id
    await db.commit()
    await db.refresh(room) #stmtを使えるので、あとで試そう！importとかmodelとか面倒だけど

    card_datas = []
    for card in room.cards:
        card_datas.append({"id": card.id, "state": card.state, "content": card.content})

    new_event = {"tag": "update", "card_datas": card_datas}

    queues_to_update = list(client_queues.values())
    for queue in queues_to_update:
        queue.put(new_event)

    return {"message": f"Card {card_id} dealt to {dst_member_id}"}
    
        
        

# Additional code
load_dotenv("../.env")

# クライアントごとに独自のキューを持つための辞書
client_queues = defaultdict(Queue)

# クライアントごとに一意のIDを生成するためのカウンタ
client_id_counter = 0

# #Server sent eventで，1秒ごとにルームの情報を返す
# @router.get("/sse")
# async def rooms_sse(request: Request):
#     event_generator = event_stream(10) #引数は普通に渡せるけど，まぁ初期値よね
#     return StreamingResponse(event_generator, media_type="text/event-stream")

# #crudsに相当
# def event_stream(initial:int):
#     count = initial
#     response = {"count": count, "members":["Tarou", "Jirou", "Saburou"]}
#     while True:
#         response["count"]=count
#         yield f"data: {json.dumps(response)}\n\n"
#         count += 1
#         time.sleep(1)  # 1秒ごとにメッセージを送信

# API経由でイベントを発火させるためのエンドポイント
# @router.post("/test-trigger")
# async def trigger_event(db: AsyncSession = Depends(get_db)):
#     # Create a copy of the dictionary values to iterate over
#     queues_to_update = list(client_queues.values())

#     for queue in queues_to_update:
#         response = await room_crud.get_rooms(db)
        
#         # Collect card data from each room
#         card_datas = []
#         for room in response:
#             for card in room.cards:
#                 card_datas.append({"state": card.state, "content": card.content})
        
#         new_queue = {"tag": "update", "card_datas": card_datas}
#         queue.put(new_queue) #new_queueはキューの中身の変数名
#         # 細かい変数の流れはよくわかってないが、ともかくこれでclient_queuesの値が更新される
#     return {"message": "Event triggered"}

# イベントが発火されたときにメッセージを送信するSSEエンドポイント
@router.get("/sse-triggered")
async def rooms_sse_triggered_by_api(request: Request):
    global client_id_counter
    client_id = client_id_counter
    client_id_counter += 1
    client_queue = client_queues[client_id] #client_queueはキューの変数名
    
    event_generator = event_stream_triggered_by_api(client_queue)
    return StreamingResponse(event_generator, media_type="text/event-stream")

def event_stream_triggered_by_api(client_queue: Queue):
    count = 0
    while True:
        # クライアントごとのキューからイベントを取得（ブロッキング）
        event = client_queue.get()
        if event['tag'] == "update":
            yield f"data: {json.dumps(event)}\n\n"
            count += 1

# @router.get("/sse-triggered/{member_id}")
# async def rooms_sse_triggered_by_api(request: Request, member_id: str):
#     client_queue = client_queues[member_id]
#     event_generator = event_stream_triggered_by_api(client_queue)
#     return StreamingResponse(event_generator, media_type="text/event-stream")

@router.get("/reset/{channel_id}")
async def reset_cards(channel_id:str, db: AsyncSession = Depends(get_db)):
    # DBを更新
    room = await room_crud.get_room_by_channel_id(db, channel_id)
    for db_card in room.cards:
        db_card.state = "Deck"
    await db.commit()
    await db.refresh(room)

    # 更新されたDBデータ(room.cards...)をQueueに追加
    card_datas = []
    for card in room.cards:
        card_datas.append({"id": card.id, "state": card.state, "content": card.content})
    new_event = {"tag": "update", "card_datas": card_datas}
    queues_to_update = list(client_queues.values())
    for queue in queues_to_update:
        queue.put(new_event)
    
    return {"message": "Cards reset"}

@router.get("/submit-all/{channel_id}")
async def reset_cards(channel_id:str, db: AsyncSession = Depends(get_db)):
    # DBを更新
    room = await room_crud.get_room_by_channel_id(db, channel_id)
    for db_card in room.cards:
        db_card.state = "Field"
    await db.commit()
    await db.refresh(room)

    # 更新されたDBデータ(room.cards...)をQueueに追加
    card_datas = []
    for card in room.cards:
        card_datas.append({"id": card.id, "state": card.state, "content": card.content})
    new_event = {"tag": "update", "card_datas": card_datas}
    queues_to_update = list(client_queues.values())
    for queue in queues_to_update:
        queue.put(new_event)
    
    return {"message": "Cards reset"}

@router.get("/submit/{channel_id}/{card_id}")
async def submit_card(channel_id:str, card_id:int, member_id: str = Query(None, description="User ID"), db: AsyncSession = Depends(get_db)):
    # DBを更新
    room = await room_crud.get_room_by_channel_id(db, channel_id)
    for db_card in room.cards:
        if db_card.id == card_id:
            # if db_card.state == member_id and db_card.state not in ["Field","Deck"]: # カードを持っている本人だけがsubmitできる、という制約
                db_card.state = "Field"
            # else:
                # raise HTTPException(status_code=403, detail="You do not have permission to submit this card. This is someone else's card.")

    await db.commit()
    await db.refresh(room)

    # 更新されたDBデータ(room.cards...)をQueueに追加
    card_datas = []
    for card in room.cards:
        card_datas.append({"id": card.id, "state": card.state, "content": card.content})
    new_event = {"tag": "update", "card_datas": card_datas}
    queues_to_update = list(client_queues.values())
    for queue in queues_to_update:
        queue.put(new_event)

    asyncio.create_task(redeal_card_Nsec_later(channel_id, card_id, db)) #member_idは現時点では不要な設計
    
    return {"message": f"Card {card_id} submitted"}

async def redeal_card_Nsec_later(channel_id:str, card_id:int,db:AsyncSession):
    try:
        await asyncio.sleep(5)  # 5秒待機
        await deal_card(channel_id, card_id, db)
    except Exception as e:
        logger(f"Error in redistribute_card_after_delay: {e}")