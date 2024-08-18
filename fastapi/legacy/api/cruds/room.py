from typing import List, Tuple, Optional

from sqlalchemy import select
from sqlalchemy.engine import Result
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException

import models.room as room_model
import schemas.room as room_schema

from sqlalchemy.orm import selectinload

from logging_config import logger

async def create_room(
    db: AsyncSession, room_create: room_schema.RoomCreate
) -> room_model.Room:
    room = room_model.Room(
        channel_id=room_create.channel_id,
        name=room_create.name,
    )
    db.add(room)
    await db.commit()
    await db.refresh(room)
    #フロントから送られるcardのデータは無視する
    default_card_datas = [
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
    db_cards = [room_model.Card(room_id=room.id, state=card['state'], content=card['content']) for card in default_card_datas]
    db.add_all(db_cards)
    await db.commit()
    await db.refresh(room)

    room_response_model = room_model.Room(
        id=room.id,
        channel_id=room.channel_id,
        name=room.name,
        cards = [room_model.Card(state=card.state, content=card.content) for card in room_create.cards]
    )
    return room_response_model

async def get_rooms(db: AsyncSession) -> List[room_model.Room]:
    result = await db.execute(
        select(room_model.Room)
        .options(
            selectinload(room_model.Room.cards),
            selectinload(room_model.Room.members)
        )
    )
    rooms = result.scalars().all()
    return rooms

async def get_room_by_channel_id(db: AsyncSession, channel_id: str) -> room_model.Room:
    result = await db.execute(
        select(room_model.Room).filter(
            room_model.Room.channel_id == channel_id
        ).options(
            selectinload(room_model.Room.cards),
            selectinload(room_model.Room.members)
        )
    )
    room = result.scalars().first()
    if room is None:
        raise HTTPException(status_code=404, detail=f"Room:{channel_id} not found")
    return room

# updateの際にそもそもidのroomが存在するか確認．実質check_roomとかroom_isExist
async def get_room(db: AsyncSession, room_id: int) -> Optional[room_model.Room]:
    result: Result = await db.execute(
        select(room_model.Room).filter(room_model.Room.id == room_id)
        )
    room: Optional[Tuple[room_model.Room]] = result.first()
    return room[0] if room is not None else None

async def update_room(
        db:AsyncSession, room_create: room_schema.RoomCreate, original: room_model.Room
) -> room_model.Room:
    original.channel_id = room_create.channel_id
    db.add(original)
    await db.commit()
    await db.refresh(original)
    return original

async def delete_room(db: AsyncSession, original: room_model.Room) -> None:
    await db.delete(original)
    await db.commit()

async def get_members(db: AsyncSession, channel_id: str) -> List[room_model.Member]:
    query = select(room_model.Member).join(room_model.Room).filter(
        room_model.Room.channel_id == channel_id
    )
    result = await db.execute(query)
    members = result.scalars().all()
    # for member in members:
    #     logger.info(f"Primary ID: {member.id}, Member ID: {member.member_id}, Name: {member.name}")
    # members = [
    #     {
    #         "id": 1,
    #         "member_id": "sfssdf",
    #         "name": "mashiro"
    #     }
    # ]
    return members

async def create_member(db: AsyncSession, channel_id: str, new_member: room_schema.MemberCreate) -> room_model.Member:
    # channel_idに対応するRoomを取得
    result = await db.execute(
        select(room_model.Room).filter(
            room_model.Room.channel_id == channel_id
        ).options(
            selectinload(room_model.Room.members)
        )
    )
    room = result.scalars().first()
    if room is None:
        raise HTTPException(status_code=404, detail=f"Room:{channel_id} not found")
    
    # 新しいMemberオブジェクトを作成
    db_member = room_model.Member(
        member_id=new_member.member_id,
        name=new_member.name,
        room_id=room.id
    )
    
    # Roomのmembersリストに追加
    db.add(db_member)
    
    # データベースに変更をコミット
    await db.commit()
    await db.refresh(db_member)
    
    return db_member

async def delete_member(db: AsyncSession, channel_id: str, member_id: str) -> room_model.Member:
    result = await db.execute(
        select(room_model.Member)
        .join(room_model.Room)
        .filter(
            room_model.Room.channel_id == channel_id,
            room_model.Member.member_id == member_id
        )
    )
    member = result.scalars().first()
    # logger.info(f"Member ss: {member}")
    if member is None:
        raise HTTPException(status_code=404, detail="Member not found")

    await db.delete(member)
    await db.commit()
    return member

# async def queue_card_datas(db: AsyncSession, client_queues: dict) -> None:
#     queues_to_update = list(client_queues.values())
#     for queue in queues_to_update:
#         response = await room_crud.get_rooms(db)
#         # Collect card data from each room
#         card_datas = []
#         for room in response:
#             for card in room.cards:
#                 card_datas.append({"state": card.state, "content": card.content})
        
#         new_queue = {"tag": "update", "card_datas": card_datas}
#         queue.put(new_queue)