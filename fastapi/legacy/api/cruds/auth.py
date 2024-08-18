import os, time, uuid, jwt
from fastapi import HTTPException
from dotenv import load_dotenv
load_dotenv("../.env")

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