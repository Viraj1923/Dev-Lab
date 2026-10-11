from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "DevBoard API"
    database_url: str = Field(validation_alias="DATABASE_URL")
    # Require a strong secret rather than silently accepting a weak JWT key.
    secret_key: str = Field(min_length=32)
    algorithm: str = "HS256"
    access_token_expire_minutes: int = Field(default=30, gt=0, le=1440)
    database_echo: bool = False
    cors_origins: list[str] = ["http://localhost:5173"]

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, value):
        # Pydantic Settings parses list environment variables as JSON by default.
        # Keep JSON-list configuration explicit and reject accidental blank values.
        if isinstance(value, str):
            import json

            value = json.loads(value)
        if not isinstance(value, list) or not all(
            isinstance(origin, str) and origin.strip() for origin in value
        ):
            raise ValueError("CORS_ORIGINS must be a JSON array of non-empty origins")
        return [origin.strip().rstrip("/") for origin in value]


settings = Settings()
