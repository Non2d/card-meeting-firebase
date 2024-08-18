from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import room
from routers import auth

app = FastAPI(docs_url="/docs", openapi_url="/openapi.json")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,   
    allow_methods=["*"],      
    allow_headers=["*"]      
)

@app.get("/")
def helloworld():
    return {"Hello": "FastAPI is running :)"}

# そのうちforで書いたりしよう
app.include_router(room.router)
app.include_router(auth.router)
# app.include_router(sse.router)