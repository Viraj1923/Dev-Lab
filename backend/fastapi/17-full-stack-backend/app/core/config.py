from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field
class Settings(BaseSettings):
    app_name: str
    database_url: str = Field(validation_alias="DATABASE_URL")
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    database_echo: bool = False

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )


settings = Settings()