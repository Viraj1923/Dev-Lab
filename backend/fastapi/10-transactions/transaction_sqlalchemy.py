from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import declarative_base, sessionmaker


# Create a SQLite database.
engine = create_engine("sqlite:///sqlalchemy_transaction.db")

Base = declarative_base()


# Define the Account table.
class Account(Base):
    __tablename__ = "accounts"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    balance = Column(Integer)


# Create the table.
Base.metadata.create_all(bind=engine)


# Create a SQLAlchemy Session factory.
SessionLocal = sessionmaker(bind=engine)


db = SessionLocal()


# Create the first account.
account = Account(
    name="Viraj",
    balance=1000
)

db.add(account)
db.commit()

print("Initial account created with ID:", account.id)


try:
    # Try to create another account with the same primary key.
    duplicate_account = Account(
        id=account.id,
        name="Duplicate",
        balance=500
    )

    db.add(duplicate_account)

    # This should fail because the ID already exists.
    db.commit()

except Exception as e:
    print("Database error:", type(e).__name__)

    # Recover the SQLAlchemy Session.
    db.rollback()

    print("Rollback completed.")


print("Session is usable again.")

db.close()