from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from migrate_db import get_db

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
async def leave_room(channel_id: str, member_id: str):
    ref = get_db(f"/{channel_id}/members/{member_id}")
    if ref.get() is None:
        raise HTTPException(status_code=404, detail=f"Member {member_id} does not exist in room {channel_id}.")
    else:
        ref.delete()
        return f"Member {member_id} left from room {channel_id}."