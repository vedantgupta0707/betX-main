from fastapi import APIRouter, Depends, HTTPException
from app.models import User, User_Pydantic
from app.utils.checks import is_admin, is_user

router = APIRouter()


@router.get("/", dependencies=[Depends(is_admin)], response_model=list[User_Pydantic])
async def get_all_users():
    """Get a list of all users."""
    return await User.all().order_by("id")


@router.put("/", dependencies=[Depends(is_admin)], response_model=User_Pydantic)
async def create_user():
    """Create a new user."""
    return await User.create_new_user()


@router.delete("/{user_id}", dependencies=[Depends(is_admin)])
async def delete_user(user_id: int):
    """Delete a user."""
    await User.filter(id=user_id).delete()
    return {"message": "User deleted."}


@router.get("/is_admin", dependencies=[Depends(is_admin)], response_model=bool)
async def check_admin():
    """Check if the user is an admin."""
    return True


@router.patch("/{user_id}/wallet", dependencies=[Depends(is_admin)])
async def patch_wallet(user_id: int, amount: int):
    """Change the wallet balance of a user."""
    user = await User.get_or_none(id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    await User.get(id=user_id).update(wallet_balance=user.wallet_balance + amount)
    return user


@router.post("/login", response_model=User_Pydantic)
async def login_user(user: User = Depends(is_user)):
    """Login a user."""
    return user
