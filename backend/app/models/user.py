from tortoise import models, fields
from tortoise.contrib.pydantic import pydantic_model_creator

from enum import Enum
import secrets
import random


class User(models.Model):
    class Meta:
        table = "users"

    id = fields.IntField(pk=True, generated=False)
    avatar = fields.CharField(max_length=255)
    password = fields.CharField(max_length=255)
    wallet_balance = fields.FloatField(default=0.0)

    @staticmethod
    async def create_new_user():
        new_id = None
        while new_id is None:
            random_id = random.randint(1000, 9999)
            if not await User.filter(id=random_id).exists():
                new_id = random_id

        password = secrets.token_hex(4)
        avatar_url = f"https://robohash.org/{new_id}"
        return await User.create(id=new_id, avatar=avatar_url, password=password)


class BetType(Enum):
    BACK = "back"
    LAY = "lay"
    FANCY="fancy"


class Bet(models.Model):
    class Meta:
        table = "bets"

    id = fields.IntField(pk=True)
    event_id = fields.CharField(max_length=255)
    event_name = fields.CharField(max_length=255)
    user = fields.ForeignKeyField("models.User", related_name="bets")
    team_name = fields.CharField(max_length=255)
    bet_type = fields.CharEnumField(BetType)
    amount = fields.FloatField()
    rate = fields.FloatField()

    created_at = fields.DatetimeField(auto_now=True)
    closed_at = fields.DatetimeField(null=True)
    result = fields.CharField(max_length=255, null=True)

    @property
    def is_open(self):
        return self.closed_at is None
    
    @property
    def event_result(self):
        if self.is_open:
            return None
        return {self.result, self.amount * self.rate}
    
    



User_Pydantic = pydantic_model_creator(User)
Bet_Pydantic = pydantic_model_creator(Bet, exclude_readonly=True)
