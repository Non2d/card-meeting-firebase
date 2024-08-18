from pydantic import BaseModel

class AuthTokenResponse(BaseModel):
    authToken: str