from fastapi import APIRouter, Depends, Body, HTTPException
from app.models import User, Bet, BetType, Bet_Pydantic
from app.routers.cricket import get_cricket_match

from app.utils.checks import is_user
import asyncio

router = APIRouter()
bet_lock = asyncio.Lock()


@router.get("/", response_model=list[Bet_Pydantic])
async def get_all_bets(user: User = Depends(is_user), open_only: bool = True):
    """
    Get a list of all bets.

    open_only: If True, only open bets are returned else all bets are returned.
    """
    if open_only:
        return await Bet.filter(user_id=user.id, closed_at__isnull=True).order_by("id")

    else:
        return await Bet.filter(user_id=user.id).order_by("id")


@router.put("/")
async def create_bet(
    user: User = Depends(is_user),
    event_id: str = Body(),
    event_name: str = Body(),
    team_name: str = Body(),
    amount: int = Body(),
    bet_type: BetType = Body(),
    rate: float = Body(),
):
    """
    Create a new bet.
    """

    async with bet_lock:
        user = await User.get(id=user.id)
        if user.wallet_balance < amount:
            raise HTTPException(
                status_code=400, detail="Insufficient funds in user's wallet."
            )

        await User.get(id=user.id).update(wallet_balance=user.wallet_balance - amount)

        bet = await Bet.create(
            event_id=event_id,
            event_name=event_name,
            team_name=team_name,
            user_id=user.id,
            bet_type=bet_type,
            amount=amount,
            rate=rate,
        )

        return bet

# app/routers/bets.py

def get_event_result(event_id: str):
    """
    Get the result of an event from the database.
    """

    match_data = get_cricket_match(event_id)

    if match_data["event"]["status"] == "SUSPENDED":
        return None
        

@router.get("/{bet_id}/status", response_model=str)
async def get_bet_status(bet_id: int):
    """
    Get the status (won, lost, open) of a specific bet.
    """
    bet = await Bet.filter(id=bet_id).first()
    if not bet:
        raise HTTPException(status_code=404, detail="Bet not found.")


    event_result = get_event_result(bet.event_id)

    if event_result is not None:
        bet.result = event_result
        await bet.save()

    if bet.closed_at is not None:
        return "settled"
    elif bet.result == "won":
        return "won"
    elif bet.result == "lost":
        return "lost"
    else:
        return "open"

