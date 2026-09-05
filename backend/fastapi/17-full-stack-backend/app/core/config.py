from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str
    database_url: str
    secret_key: str
    ALGORITHM:str
    ACCESS_TOKEN_EXPIRE_MINUTES:str


    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )


settings = Settings()