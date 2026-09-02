from config import settings

print("App:", settings.app_name)
print("Environment:", settings.app_env)
print("Debug:", settings.debug)
print("Database:", settings.database_url)
print("JWT Secret:", settings.jwt_secret)