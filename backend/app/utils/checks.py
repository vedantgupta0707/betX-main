from fastapi import Header, HTTPException
from app.config import ADMIN_ID, ADMIN_PASSWD
from app.models import User


async def is_admin(username: str = Header(...), password: str = Header(...)) -> None:
    # Check if username & pwd Header exists
    if not all([username, password]):
        raise HTTPException(status_code=401, detail="Admin credentials are missing.")

    # Check if username & pwd Header is correct
    if username != ADMIN_ID or password != ADMIN_PASSWD:
        raise HTTPException(status_code=401, detail="Admin credentials are invalid.")


async def is_user(id: int = Header(...), password: str = Header(...)) -> User | None:
    # Check if id & pwd Header exists
    if not all([id, password]):
        raise HTTPException(status_code=401, detail="User credentials are missing.")

    # Check if id & pwd Header is correct
    user = await User.get_or_none(id=id, password=password)
    if not user:
        raise HTTPException(status_code=401, detail="User credentials are invalid.")

    return user
