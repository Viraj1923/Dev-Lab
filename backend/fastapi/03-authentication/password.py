from passlib.context import CryptContext

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

hashed = hash_password("secret123")

print("Hash:", hashed)

print(
    "Correct:",
    verify_password("secret123", hashed)
)

print(
    "Wrong:",
    verify_password("wrongpassword", hashed)
)