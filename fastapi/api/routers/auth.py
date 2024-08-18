from fastapi import APIRouter, HTTPException
from fastapi.requests import Request

from dotenv import load_dotenv
load_dotenv("./.env")

import httpx

#schema
from pydantic import BaseModel
class AuthTokenResponse(BaseModel):
    authToken: str

#db functions
import os, time, uuid, jwt
from fastapi import HTTPException

def generate_auth_token():
    try:
        payload = {
            "jti": str(uuid.uuid4()),
            "iat": int(time.time()),
            "exp": int(time.time()) + 60 * 60 * 24 * 2,  # 72時間より長いとエラー．死んでも7日とかにするな． 
            "scope": {
                "app": {
                    "id": os.getenv("APP_ID"),
                    "turn": True,
                    "actions": ["read"],
                    "channels": [
                        {
                            "id": "*",
                            "name": "*",
                            "actions": ["write"],
                            "members": [
                                {
                                    "id": "*",
                                    "name": "*",
                                    "actions": ["write"],
                                    "publication": {
                                        "actions": ["write"],
                                    },
                                    "subscription": {
                                        "actions": ["write"],
                                    },
                                },
                            ],
                            "sfuBots": [
                                {
                                    "actions": ["write"],
                                    "forwardings": [
                                        {
                                            "actions": ["write"]
                                        }
                                    ]
                                }
                            ]
                        },
                    ],
                },
            },
        }
        token = jwt.encode(payload, os.getenv("SKYWAY_SECRET_KEY"), algorithm="HS256")
        return token
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating token: {str(e)}")
    
def generate_admin_auth_token():
    payload = {
        "iat": int(time.time()),  # 現在のUNIXタイムスタンプ
        "jti": str(uuid.uuid4()),  # ランダムなUUID
        "exp": int(time.time()) + 60 * 60 * 24 * 2,  # 1週間後のUNIXタイムスタンプ
        "appId": os.getenv("APP_ID")  # アプリケーションID
    }

    SECRET_KEY = os.getenv("SKYWAY_SECRET_KEY")  # シークレットキー
    token = jwt.encode(payload, SECRET_KEY)
    return token

#routers

router = APIRouter()

@router.get("/auth", response_model=AuthTokenResponse)
def get_auth_token():
    try:
        authToken = generate_auth_token()
        return AuthTokenResponse(authToken=authToken)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Token generation failed: {str(e)}")

@router.get("/admin-auth") # 
async def get_admin_auth_token():
    return generate_admin_auth_token()

@router.post("/find-channel")
async def find_channel(channel_name: str = None):
    url = "https://channel.skyway.ntt.com/v1/json-rpc"
    admin_token = generate_admin_auth_token()
    headers = {
        "Authorization": "Bearer "+admin_token,  # トークンを適切なものに置き換えてください
        "Content-Type": "application/json"
    }
    json_body = {
        "jsonrpc": "2.0",
        "id": 0,
        "method": "findChannel",
        "params": {
            "name": channel_name
        }
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(url, headers=headers, json=json_body)
        response_data = response.json()

    if response.is_error:
        raise HTTPException(status_code=response.status_code, detail=response_data)
    
    return response_data
