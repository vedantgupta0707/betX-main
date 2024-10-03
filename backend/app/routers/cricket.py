from fastapi import APIRouter, HTTPException
from app.config import THIRD_PARTY_API
import httpx
from app.models import CricketEvent


router = APIRouter()


@router.get("/", response_model=list[CricketEvent])
async def get_all_matches():
    """
    Get data of all cricket matches.
    """
    url = THIRD_PARTY_API + "/exchange/market/matchodds/allEventsList"
    async with httpx.AsyncClient() as client:
        response = await client.post(url)
        if not response.status_code == 200:
            raise HTTPException(status_code=500, detail="Something went wrong.")

        data = response.json()["data"]

        return data["4"]


@router.get("/{event_id}")
async def get_cricket_match(event_id: str):
    """
    Get data of a cricket match.
    """
    url = THIRD_PARTY_API + "/exchange/market/getMarketsOfEventList"
    body = {
        "eventId": event_id,
        "sportId": "4",
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(url, json=body)
        if not response.status_code == 200:
            raise HTTPException(status_code=500, detail="Something went wrong.")

        to_return = response.json()["data"]

    url = THIRD_PARTY_API + "/exchange/market/matchodds/allEventsList"
    async with httpx.AsyncClient() as client:
        response = await client.post(url)
        if not response.status_code == 200:
            raise HTTPException(status_code=500, detail="Something went wrong.")

        all_matches = response.json()["data"]["4"]

        for match in all_matches:
            if match["exEventId"] == event_id:
                to_return["event_details"] = match

        return to_return
