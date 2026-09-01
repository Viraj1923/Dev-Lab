import sqlite3


connection = sqlite3.connect("transaction_demo.db")

cursor = connection.cursor()

# cursor.execute("""
#     CREATE TABLE IF NOT EXISTS accounts (
#         id INTEGER PRIMARY KEY,
#         name TEXT,
#         balance INTEGER
#     )
# """)

# cursor.execute(
#     "INSERT INTO accounts (name, balance) VALUES (?, ?)",
#     ("Viraj", 1000)
# )

# connection.commit()

# print("Initial account created.")

# Start a new transaction by changing the balance.

cursor.execute(
    "UPDATE accounts SET balance = ? WHERE name = ?",
    (800, "Viraj")
)

print("Balance after update:", end=" ")

cursor.execute(
    "SELECT balance FROM accounts WHERE name = ?",
    ("Viraj",)
)

print(cursor.fetchone()[0])

# Undo the uncommitted change.
connection.rollback()

print("Balance after rollback:", end=" ")

cursor.execute(
    "SELECT balance FROM accounts WHERE name = ?",
    ("Viraj",)
)

print(cursor.fetchone()[0])

connection.close()