import os

import psycopg2
from fastapi import FastAPI

app = FastAPI()

# Read the database URL from the environment.
# Docker Compose provides this value to the container.
DATABASE_URL = os.getenv("DATABASE_URL")


@app.get("/")
def home():
    return {
        "message": "FastAPI + PostgreSQL"
    }


@app.get("/db-test")
def database_test():

    # Connect to PostgreSQL using the DATABASE_URL.
    connection = psycopg2.connect(DATABASE_URL)

    # Create a cursor so we can execute SQL.
    cursor = connection.cursor()

    # Ask PostgreSQL for its current version.
    cursor.execute("SELECT version()")

    # Get the result returned by PostgreSQL.
    result = cursor.fetchone()

    # Close the cursor and database connection.
    cursor.close()
    connection.close()

    return {
        "database": result[0]
    }