from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.db.supabase_client import get_supabase

security = HTTPBearer()


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    max_retries = 2
    last_error = None
    
    for attempt in range(max_retries):
        try:
            # Use Supabase's own auth API to validate the token — no JWT secret needed
            supabase = get_supabase()
            user_response = supabase.auth.get_user(token)
            if not user_response or not user_response.user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Token invalide",
                    headers={"WWW-Authenticate": "Bearer"},
                )
            user = user_response.user
            print(f"[auth] user verified: id={user.id}, email={user.email}")
            return {"user_id": str(user.id), "email": user.email}
        except HTTPException:
            raise
        except Exception as e:
            last_error = e
            if attempt < max_retries - 1:
                print(f"[auth] error (attempt {attempt + 1}/{max_retries}): {e}. Retrying...")
                continue
            print(f"[auth] error: {e}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Could not validate credentials: {str(e)}",
                headers={"WWW-Authenticate": "Bearer"},
            )
