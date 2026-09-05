from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse

from app.routers.auth import router as auth_router
from app.core.exceptions import (
    EmailAlreadyRegisteredError,
    InvalidCredentialsError,
)

app = FastAPI()


@app.exception_handler(EmailAlreadyRegisteredError)
async def email_already_registered_handler(
    request: Request,
    exc: EmailAlreadyRegisteredError
):
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"detail": "Email already registered"},
    )


@app.exception_handler(InvalidCredentialsError)
async def invalid_credentials_handler(
    request: Request,
    exc: InvalidCredentialsError
):
    return JSONResponse(
        status_code=status.HTTP_401_UNAUTHORIZED,
        content={"detail": "Invalid email or password"},
    )


app.include_router(auth_router)