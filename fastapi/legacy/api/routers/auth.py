from fastapi import APIRouter, HTTPException
from fastapi.requests import Request

from cruds.auth import generate_auth_token, generate_admin_auth_token

from dotenv import load_dotenv
load_dotenv("../.env")

import httpx

import schemas.auth

router = APIRouter()

@router.get("/auth", response_model=schemas.auth.AuthTokenResponse)
def get_auth_token():
    try:
        authToken = generate_auth_token()
        return schemas.auth.AuthTokenResponse(authToken=authToken)
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