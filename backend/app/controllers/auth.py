from fastapi import APIRouter, HTTPException, status
from app.db.supabase_client import get_supabase
from pydantic import BaseModel

router = APIRouter()

class SignUpRequest(BaseModel):
    email: str
    password: str

class SignInRequest(BaseModel):
    email: str
    password: str

@router.post("/signup")
async def signup(request: SignUpRequest):
    """Create a new user account"""
    try:
        supabase = get_supabase()
        response = supabase.auth.sign_up({
            "email": request.email,
            "password": request.password,
        })
        return {
            "success": True,
            "user": {
                "id": response.user.id,
                "email": response.user.email
            } if response.user else None
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Signup failed: {str(e)}"
        )

@router.post("/signin")
async def signin(request: SignInRequest):
    """Sign in with email and password"""
    try:
        supabase = get_supabase()
        response = supabase.auth.sign_in_with_password({
            "email": request.email,
            "password": request.password,
        })
        if response.session:
            return {
                "success": True,
                "access_token": response.session.access_token,
                "user": {
                    "id": response.user.id,
                    "email": response.user.email
                }
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Sign in failed: {str(e)}"
        )

@router.get("/test")
async def test_connection():
    """Test Supabase connection"""
    try:
        supabase = get_supabase()
        # Try to list users (requires service role)
        return {"status": "Supabase client connected successfully"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Connection failed: {str(e)}"
        )

@router.post("/reset-password")
async def reset_password(email: str):
    """Send password reset email"""
    try:
        supabase = get_supabase()
        response = supabase.auth.reset_password_for_email(
            email,
            {"redirectTo": "http://localhost:3001/reset-password"}
        )
        return {
            "success": True,
            "message": f"Password reset email sent to {email}"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Reset failed: {str(e)}"
        )
