from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "watergate backend"
    database_url: str = "mysql+pymysql://watergate:watergate@db:3306/watergate"
    cors_origins: str = "http://localhost:3000"
    sql_echo: bool = False

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )


settings = Settings()
