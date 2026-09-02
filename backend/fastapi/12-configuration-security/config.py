from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str
    app_env: str
    debug: bool
    database_url: str
    jwt_secret: str = Field(min_length=1)
    frontend_origin: str

    model_config = SettingsConfigDict(env_file=".env")


settings = Settings()