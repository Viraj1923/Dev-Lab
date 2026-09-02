import os
from dotenv import load_dotenv

load_dotenv()

app_name = os.getenv("APP_NAME")
debug = os.getenv("DEBUG")
database_url = os.getenv("DATABASE_URL")
jwt_secret = os.getenv("JWT_SECRET")

print("App:", app_name)
print("Debug:", debug)
print("Database:", database_url)
print("JWT Secret:", jwt_secret)