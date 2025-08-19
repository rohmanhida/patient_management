from fastapi import HTTPException
from services.auth import models
from typing import List
from functools import wraps

class Permission:
    PATIENT_CREATE = "patient:create"
    PATIENT_READ = "patient:read"
    PATIENT_UPDATE = "patient:update"
    PATIENT_DELETE = "patient:delete"

def require_permissions(required_permissions: List[str]):
    # Decorator
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Get user from dependency injection
            user = None
            for key, value in kwargs.items():
                if isinstance(value, models.UserType):
                    user = value
                    break
            
            if not user:
                raise HTTPException(status_code=401, detail="Authentication required")
            
            # Check permissions
            user_permissions = set(user.permissions)
            required_perms = set(required_permissions)
            
            if not required_perms.issubset(user_permissions):
                missing = required_perms - user_permissions
                raise HTTPException(
                    status_code=403, 
                    detail=f"Missing permissions: {list(missing)}"
                )
            
            return await func(*args, **kwargs)
        return wrapper
    return decorator

def require_roles(required_roles: List[str]):
    # Decorator
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            user = None
            for key, value in kwargs.items():
                if isinstance(value, models.UserType):
                    user = value
                    break
            
            if not user:
                raise HTTPException(status_code=401, detail="Authentication required")
            
            user_roles = set(user.roles)
            required_role_set = set(required_roles)
            
            if not user_roles.intersection(required_role_set):
                raise HTTPException(
                    status_code=403, 
                    detail=f"Required roles: {required_roles}"
                )
            
            return await func(*args, **kwargs)
        return wrapper
    return decorator
