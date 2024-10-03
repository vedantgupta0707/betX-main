from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from tortoise.contrib.fastapi import register_tortoise
from app.config import TORTOISE_CONF
from app.routers import users, cricket, bets


app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(cricket.router, prefix="/cricket", tags=["cricket"])
app.include_router(bets.router, prefix="/bets", tags=["bets"])


@app.get("/")
async def root():
    return {"message": "Hello World"}


register_tortoise(
    app,
    config=TORTOISE_CONF,
    generate_schemas=True,
    add_exception_handlers=True,
)
