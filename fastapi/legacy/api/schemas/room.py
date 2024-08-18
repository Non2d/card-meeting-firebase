from typing import List, Optional
from pydantic import BaseModel, Field #BaseModelはFastAPIで使われるスキーマモデルクラスのベースクラス

class Card(BaseModel):
    state : str = Field(..., example="yamafuda/draw/horobi")
    content : str = Field(..., example="Buy milk")

class MemberBase(BaseModel):
    member_id : str = Field(..., example="nu23yrcieacn3uyx")
    name : str = Field(..., example="Alice")

class MemberCreate(MemberBase):
    pass

class MemberCreateResponse(MemberCreate):
    id: int
    class Config:
        orm_mode = True

class Member(MemberBase):
    id: int

    class Config: #DBとの接続時に使う
        orm_mode = True

class RoomBase(BaseModel): #共通のフィールドを持つベースクラスを定義
    channel_id : str = Field(..., example="1248123")
    name : str = Field(..., example="room1")
    members: Optional[List[Member]] = Field(..., example=[])
    cards: Optional[List[Card]] = Field(..., example=[{"state": "Deck", "content": "みんなしよう！"}])

class RoomCreate(RoomBase):
    pass

class RoomCreateResponse(RoomCreate):
    id: int
    class Config:
        orm_mode = True

class Room(RoomBase):
    id: int

    class Config: #DBとの接続時に使う
        orm_mode = True