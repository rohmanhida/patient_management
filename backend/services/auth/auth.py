import os, json, requests
from fastapi import Depends, HTTPException, APIRouter
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import firebase_admin
from firebase_admin import credentials, auth
from typing import List
from services.auth import models

routes = APIRouter()
firebase_creds = os.getenv("FIREBASE_CREDENTIALS")
if not firebase_creds:
    raise RuntimeError("FIREBASE_CREDENTIALS environment variable not set")
firebase_api_key = os.getenv("FIREBASE_API_KEY")
if not firebase_api_key:
    raise RuntimeError("FIREBASE_API_KEY environment variable not set")

# Parse the JSON string into Python dict
cred_dict = json.loads(firebase_creds)
cred = credentials.Certificate(cred_dict)
firebase_admin.initialize_app(cred)
security = HTTPBearer()

def verify_token(auth_credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = auth_credentials.credentials
    try:
        decoded_token = auth.verify_id_token(token)
        uid = decoded_token['uid']
        email = decoded_token.get('email', '')
        custom_claim = auth.get_user(uid).custom_claims or {}
        roles = custom_claim.get('roles', [])
        permissions = custom_claim.get('permissions', [])
        return models.UserType( uid = uid, email = email, roles = roles, permissions = permissions)
    except:
        raise HTTPException(status_code=403, detail="You have no authorization to access this page")

@routes.post("/login")
async def login(user: models.LoginType):
    url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={firebase_api_key}"
    payload = {
        "email": user.email,
        "password": user.password,
        "returnSecureToken": True
    }

    user_detail = requests.post(url, json=payload).json()
    if 'error' in user_detail:
        raise HTTPException(status_code=user_detail['error']['code'], detail=user_detail['error']['message'])

    return user_detail

@routes.post("/permissions")
def set_user_custom_claims(uid: str, roles: List[str], permissions: List[str]):
    try:
        auth.set_custom_user_claims(uid, {
            'roles': roles,
            'permissions': permissions
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to set claims: {str(e)}")

    user_record = auth.get_user(uid)
    custom_claims = user_record.custom_claims or {}
    return models.UserType( uid = uid, email = user_record.email, roles = custom_claims.get('roles', []), permissions = custom_claims.get('permissions', []))

@routes.get("/check_users")
def check_users(max: int = 1000):
    try:
        users_list = []
        page = auth.list_users(max_results=max)
        
        while page:
            for user in page.users:
                custom_claims = user.custom_claims or {}
                user_data = {
                    'uid': user.uid,
                    'email': user.email,
                    'display_name': user.display_name,
                    'phone_number': user.phone_number,
                    'email_verified': user.email_verified,
                    'disabled': user.disabled,
                    'creation_time': user.user_metadata.creation_timestamp,
                    'last_sign_in': user.user_metadata.last_sign_in_timestamp,
                    'roles': custom_claims.get('roles', []),
                    'permissions': custom_claims.get('permissions', [])
                }
                users_list.append(user_data)
            
            page = page.get_next_page() if page.has_next_page else None
            
        return users_list
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get users: {str(e)}")
