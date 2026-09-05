from jose import jwt
from datetime import datetime, timedelta, timezone

from app.core.config import settings


ALGORITHM = "HS256"


def create_access_token(data: dict):
    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + timedelta(minutes=30)

    to_encode.update({
        "exp": expire
    })

    return jwt.encode(
        to_encode,
        settings.secret_key,
        algorithm=ALGORITHM
    )


def decode_access_token(token: str):
    return jwt.decode(
        token,
        settings.secret_key,
        algorithms=[ALGORITHM]
    )