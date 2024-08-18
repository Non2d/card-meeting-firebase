# from fastapi import APIRouter, Request, HTTPException
# from db import get_db
# from fastapi import Depends
# from sqlalchemy.ext.asyncio import AsyncSession
# from typing import List, Any
# import schemas.room as room_schema
# import cruds.room as room_crud
# from fastapi.responses import StreamingResponse
# import time, json, uuid, jwt, os, httpx
# from dotenv import load_dotenv

# from queue import Queue
# from threading import Thread
# from collections import defaultdict

# load_dotenv("../.env")

# router = APIRouter()

# # クライアントごとに独自のキューを持つための辞書
# client_queues = defaultdict(Queue)

# # クライアントごとに一意のIDを生成するためのカウンタ
# client_id_counter = 0

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


# # API経由でイベントを発火させるためのエンドポイント
# @router.post("/trigger")
# async def trigger_event():
#     for queue in client_queues.values():
#         queue.put("update")
#     return {"message": "Event triggered"}

# # イベントが発火されたときにメッセージを送信するSSEエンドポイント
# @router.get("/sse-triggered")
# async def rooms_sse_triggered_by_api(request: Request):
#     global client_id_counter
#     client_id = client_id_counter
#     client_id_counter += 1
#     client_queue = client_queues[client_id]
    
#     event_generator = event_stream_triggered_by_api(client_queue)
#     return StreamingResponse(event_generator, media_type="text/event-stream")

# def event_stream_triggered_by_api(client_queue: Queue):
#     count = 0
#     response = {"count": count, "members": ["Tarou", "Jirou", "Saburou"]}
#     while True:
#         # クライアントごとのキューからイベントを取得（ブロッキング）
#         event = client_queue.get()
#         if event == "update":
#             response["count"] = count
#             yield f"data: {json.dumps(response)}\n\n"
#             count += 1