from pydantic import BaseModel


class OddsData(BaseModel):
    inPlay: bool
    preBet: bool
    betDelay: int
    totalMatched: int
    status: str
    crossMatching: bool
    runners: list


class CricketEvent(BaseModel):
    _id: str
    marketId: str
    marketName: str
    exEventId: str
    eventName: str
    sportId: str
    sportName: str
    eventTime: str
    tournamentId: str
    tournamentName: str
    oddsData: OddsData
