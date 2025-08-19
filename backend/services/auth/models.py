from pydantic import BaseModel
from typing import List

class LoginType(BaseModel):
    email: str
    password: str

class UserType(BaseModel):
    uid: str
    email: str
    roles: List[str]
    permissions: List[str]
