from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "DevBoard API"
    database_url: str = Field(validation_alias="DATABASE_URL")
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    database_echo: bool = False
    cors_origins: list[str] = ["http://localhost:5173"]

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )


settings = Settings()
