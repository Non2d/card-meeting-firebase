import firebase_admin
from firebase_admin import credentials, db
from dotenv import load_dotenv
load_dotenv("./.env")
import os

print("Resetting the database...")

# Firebaseのサービスアカウントキーのパス
SERVICE_ACCOUNT_KEY_PATH = os.getenv("FB_SERVICE_ACCOUNT_KEY_PATH")

# Firebase Admin SDKの初期化
try:
    cred = credentials.Certificate(SERVICE_ACCOUNT_KEY_PATH)
    firebase_admin.initialize_app(cred, {
        'databaseURL': os.getenv("FB_DATABASE_URL")
    })
except ValueError as e:
    print(f"Error initializing Firebase Admin SDK: {e}")
    raise

# データベースのリセット
def reset_database():
    ref = db.reference('/')
    ref.set({
        'SFU_DoNotEnter-a454f433-4561-fc71-1306-dd98ed2d0780': {
            'members': {
                'nuvau34asdumx9382' : {'name': 'Alice'},
                'uydcui2387scmaeu5' : {'name': 'Mario'},
            },
            'cards': [
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
            ],
        }
    })

if __name__ == "__main__":
    reset_database()

# db.reference('/') を返す関数
def get_db(path='/'):
    return db.reference(path)