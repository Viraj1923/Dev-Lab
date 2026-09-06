# 🔄 SQLAlchemy Transactions, Rollbacks & Database Integrity

> **Module 10** of the FastAPI learning series.

This module focuses on how **database transactions** work with SQLite, SQLAlchemy, and FastAPI.

The examples demonstrate what happens when database operations succeed, fail, or need to be undone.

---

## 🎯 What This Module Teaches

```text
Database Operation
       ↓
    Transaction
       ↓
 ┌─────┴─────┐
 │           │
Success     Failure
 │           │
Commit     Rollback
 │           │
Persist    Undo changes
```

The module covers:

- 🔄 Transactions
- ↩️ Rollbacks
- 💾 Commits
- 🔧 SQLAlchemy sessions
- `flush()`
- `refresh()`
- 🔗 Foreign-key constraints
- 🔒 Unique constraints
- 💥 Recovering a failed SQLAlchemy session
- 🚨 The N+1 query problem
- 🚀 `selectinload()`
- 🌐 Transaction handling inside FastAPI

---

# 📁 Project Structure

```text
10-transactions/
│
├── foreign_key.py
├── n_plus_one.py
├── refresh_demo.py
├── transaction_api.py
├── transaction_demo.py
├── transaction_sqlalchemy.py
└── unique_constraint.py
```

### File responsibilities

| File | Focus |
|---|---|
| `transaction_demo.py` | Basic SQLite transaction and rollback |
| `transaction_sqlalchemy.py` | SQLAlchemy transaction failure and session recovery |
| `foreign_key.py` | Foreign-key constraint enforcement and rollback |
| `unique_constraint.py` | Unique constraint violation and rollback |
| `refresh_demo.py` | `commit()` and `refresh()` behavior |
| `transaction_api.py` | Transactional database operation inside FastAPI |
| `n_plus_one.py` | Relationship loading with `selectinload()` |

---

# 1. 🔄 Basic Database Transactions

`transaction_demo.py` uses Python's built-in `sqlite3` library.

The example updates an account balance:

```python
cursor.execute(
    "UPDATE accounts SET balance = ? WHERE name = ?",
    (800, "Viraj")
)
```

The new balance is then queried before the transaction is committed.

The example prints:

```text
Balance after update: 800
```

Then:

```python
connection.rollback()
```

undoes the uncommitted change.

The balance is queried again:

```text
Balance after rollback: 1000
```

The important concept is:

```text
UPDATE
  ↓
Uncommitted change
  ↓
ROLLBACK
  ↓
Previous database state
```

---

# 2. 💾 Commit vs Rollback

A transaction generally has two important outcomes.

### Commit

```python
connection.commit()
```

means:

```text
Make the transaction's changes permanent.
```

### Rollback

```python
connection.rollback()
```

means:

```text
Undo the uncommitted changes.
```

Conceptually:

```text
              Transaction
                   │
          ┌────────┴────────┐
          ↓                 ↓
       Success            Failure
          │                 │
       COMMIT            ROLLBACK
          │                 │
       Keep changes      Undo changes
```

---

# 3. 🧱 SQLAlchemy Transactions

`transaction_sqlalchemy.py` demonstrates the same basic idea using a SQLAlchemy `Session`.

An account is created:

```python
account = Account(
    name="Viraj",
    balance=1000
)

db.add(account)
db.commit()
```

The initial account is persisted.

Then the example attempts to create another account with the **same primary key**:

```python
duplicate_account = Account(
    id=account.id,
    name="Duplicate",
    balance=500
)
```

The commit fails because the primary key already exists.

The exception is caught:

```python
except Exception as e:
```

and the session is rolled back:

```python
db.rollback()
```

---

# 4. 🚨 Why `rollback()` Is Necessary

After a database operation fails, the SQLAlchemy session is left in a failed transaction state.

The example explicitly recovers it with:

```python
db.rollback()
```

After rollback, the script prints:

```text
Session is usable again.
```

The important pattern is:

```python
try:
    db.add(...)
    db.commit()

except Exception:
    db.rollback()
```

Without the rollback, attempting to continue using the failed session can cause further errors.

---

# 5. 🔗 Foreign-Key Constraints

`foreign_key.py` demonstrates database-level referential integrity.

The `Post` model contains:

```python
user_id = Column(
    Integer,
    ForeignKey("users.id")
)
```

This means a post's `user_id` is expected to reference an existing user.

SQLite foreign-key enforcement is explicitly enabled:

```python
@event.listens_for(engine, "connect")
def enable_foreign_keys(dbapi_connection, connection_record):
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()
```

This is important because the example relies on SQLite actually enforcing the foreign-key constraint.

---

# 6. ❌ Invalid Foreign-Key Insert

The script first creates a valid user.

Then it attempts:

```python
post = Post(
    title="Invalid Post",
    user_id=999
)
```

The user with ID `999` does not exist.

The database therefore raises:

```python
IntegrityError
```

The example handles it:

```python
except IntegrityError:
    print("Foreign-key constraint violated.")

    db.rollback()
```

The transaction is recovered with:

```python
db.rollback()
```

The session can then continue to be queried.

---

# 7. 🔒 Unique Constraints

`unique_constraint.py` demonstrates a unique database constraint.

The `User` model defines:

```python
email = Column(
    String,
    unique=True
)
```

This means two users cannot have the same email value.

The first user is created with:

```text
viraj@gmail.com
```

Then another user attempts to use the same email:

```python
user2 = User(
    name="Rahul",
    email="viraj@gmail.com"
)
```

The commit raises:

```python
IntegrityError
```

The transaction is recovered:

```python
db.rollback()
```

The example then queries the database to verify that the session remains usable.

---

# 8. 🧠 Database Constraints vs Application Validation

This module demonstrates an important distinction.

### Application-level validation

```text
FastAPI / Python
       ↓
Validate input
```

### Database-level integrity

```text
SQLAlchemy
    ↓
Database
    ↓
Constraint enforcement
```

Constraints such as:

```text
PRIMARY KEY
FOREIGN KEY
UNIQUE
```

protect the database itself.

Even if application code accidentally allows an invalid operation, the database can reject it.

---

# 9. 🔄 Transactional FastAPI Endpoint

`transaction_api.py` combines FastAPI with SQLAlchemy transactions.

The endpoint is:

```text
POST /users-with-post
```

It receives:

```text
user_name
post_title
```

and performs two database operations:

```text
Create User
    ↓
Create Post
```

Both operations are part of the same transaction.

---

# 10. 🧩 Using `flush()`

The endpoint creates the user:

```python
user = User(name=user_name)

db.add(user)
```

Then:

```python
db.flush()
```

is called.

Why?

Because the newly created user needs an ID before creating the post:

```python
post = Post(
    title=post_title,
    user_id=user.id
)
```

The flow is:

```text
db.add(user)
      ↓
db.flush()
      ↓
user.id becomes available
      ↓
create Post using user.id
```

### Important distinction

`flush()` sends pending changes to the database within the current transaction.

It does **not** replace:

```python
db.commit()
```

The endpoint still commits after both operations succeed.

---

# 11. 💾 Committing Multiple Operations Together

The endpoint performs:

```python
db.add(user)

db.flush()

db.add(post)

db.commit()
```

The intent is:

```text
Create User
    +
Create Post
    ↓
One transaction
    ↓
COMMIT
```

If everything succeeds, both records are persisted.

---

# 12. ↩️ Rolling Back the FastAPI Transaction

The endpoint uses:

```python
try:
    ...
    db.commit()

except Exception:
    db.rollback()
    raise
```

If any operation fails:

```text
Create User
    ↓
Something fails
    ↓
ROLLBACK
    ↓
Undo transaction
    ↓
Re-raise exception
```

This prevents the application from leaving the transaction in a failed state.

---

# 13. 🔄 `commit()` and `refresh()`

`refresh_demo.py` demonstrates the difference between:

```python
db.commit()
```

and:

```python
db.refresh(user)
```

Before commit:

```python
user = User(name="Viraj")
db.add(user)

print("Before commit:", user.id)
```

The ID has not yet been assigned in the example.

After:

```python
db.commit()
```

the generated ID becomes available:

```python
print("After commit:", user.id)
```

Then:

```python
db.refresh(user)
```

refreshes the object's state from the database.

---

# 14. 🔍 Querying from a New Session

The example then closes the first session and creates another:

```python
db2 = SessionLocal()
```

It queries the database:

```python
saved_user = db2.query(User).first()
```

and prints:

```text
User from new session: Viraj
```

This demonstrates that the committed record exists independently of the original SQLAlchemy session.

Conceptually:

```text
Session 1
   ↓
Create User
   ↓
Commit
   ↓
Database
   ↓
Session 1 closed
   ↓
Session 2
   ↓
Query User
```

---

# 15. 🚨 N+1 Query Problem

`n_plus_one.py` revisits relationship loading.

The module defines:

```text
User → Posts
```

with:

```python
posts = relationship(
    "Post",
    back_populates="user"
)
```

The engine is configured with:

```python
echo=True
```

so generated SQL queries are visible in the terminal.

The example creates:

```text
Viraj
Rahul
Alex
```

and several posts.

---

# 16. 🚀 Solving N+1 with `selectinload()`

The users are loaded with:

```python
users = (
    db.query(User)
    .options(selectinload(User.posts))
    .all()
)
```

The important part is:

```python
selectinload(User.posts)
```

Instead of relying on relationship access to independently load posts for every user, SQLAlchemy loads the related collection using an additional SELECT strategy.

Conceptually:

```text
Query users
     ↓
Query related posts
     ↓
Associate posts with users
```

This avoids the inefficient pattern of repeatedly querying the database for each individual user's posts.

---

# 17. 🧠 Transaction Failure Recovery Pattern

The module repeatedly demonstrates this reliable SQLAlchemy pattern:

```python
try:
    # database operations

    db.commit()

except Exception:
    db.rollback()
    raise
```

For expected database constraint errors, the exception can be handled specifically:

```python
except IntegrityError:
    db.rollback()
```

The essential rule is:

> **If a SQLAlchemy transaction fails, rollback the session before continuing to use it.**

---

# 📊 Concepts Demonstrated

| Concept | Example |
|---|---|
| Transaction | `transaction_demo.py` |
| Commit | `connection.commit()` / `db.commit()` |
| Rollback | `connection.rollback()` / `db.rollback()` |
| SQLAlchemy session recovery | `transaction_sqlalchemy.py` |
| Foreign key | `foreign_key.py` |
| Unique constraint | `unique_constraint.py` |
| `flush()` | `transaction_api.py` |
| `refresh()` | `refresh_demo.py` |
| New session query | `refresh_demo.py` |
| N+1 problem | `n_plus_one.py` |
| `selectinload()` | `n_plus_one.py` |
| FastAPI transaction | `transaction_api.py` |

---

# 🧪 Suggested Experiment Order

Run the examples individually from the module directory.

### 1️⃣ Basic transaction

```bash
python transaction_demo.py
```

Observe:

```text
Balance after update: 800
Balance after rollback: 1000
```

### 2️⃣ SQLAlchemy rollback

```bash
python transaction_sqlalchemy.py
```

Observe the database error and:

```text
Rollback completed.
Session is usable again.
```

### 3️⃣ Foreign-key constraint

```bash
python foreign_key.py
```

Observe:

```text
Foreign-key constraint violated.
Rollback completed.
```

### 4️⃣ Unique constraint

```bash
python unique_constraint.py
```

Observe:

```text
Unique constraint violated.
Rollback completed.
```

### 5️⃣ Commit and refresh

```bash
python refresh_demo.py
```

Observe the difference between:

```text
Before commit
After commit
After refresh
```

and then the record being available from a new session.

### 6️⃣ N+1 / eager loading

```bash
python n_plus_one.py
```

Because:

```python
echo=True
```

is enabled, inspect the SQLAlchemy queries printed in the terminal.

### 7️⃣ FastAPI transaction

Run:

```bash
uvicorn transaction_api:app --reload
```

Then open:

```text
http://127.0.0.1:8000/docs
```

Test:

```text
POST /users-with-post
```

---

# 🔄 Transaction Flow in the API

The main transactional endpoint follows this structure:

```text
HTTP Request
     │
     ▼
Create User
     │
     ▼
db.flush()
     │
     ▼
Get User ID
     │
     ▼
Create Post
     │
     ▼
db.commit()
     │
 ┌───┴───┐
 ↓       ↓
Success Failure
 ↓       ↓
Persist  db.rollback()
         ↓
       raise
```

---

# 🧠 Key Takeaways

### Transactions

- 🔄 Database operations happen inside transactions.
- 💾 `commit()` makes successful changes persistent.
- ↩️ `rollback()` undoes uncommitted changes.
- 🚨 A failed SQLAlchemy transaction should be rolled back before reusing the session.

### SQLAlchemy

- 🔧 A `Session` manages database operations and transaction state.
- `flush()` sends pending changes without committing the transaction.
- `refresh()` reloads an ORM object's state from the database.
- A committed record can be queried from a completely new session.

### Database integrity

- 🔑 Primary keys prevent duplicate identifiers.
- 🔗 Foreign keys enforce relationships between records.
- 🔒 Unique constraints prevent duplicate values such as emails.
- `IntegrityError` is used in the examples to handle database constraint failures.

### FastAPI

- 🌐 Database transactions can wrap multiple operations inside a single API request.
- 🔄 Dependency-injected SQLAlchemy sessions can be used directly inside route handlers.
- 🧹 The database dependency closes the session after the request.

### Performance

- 🚨 N+1 queries can happen when related collections are loaded inefficiently.
- 🚀 `selectinload()` can efficiently load related collections.

---

# 🏁 Module Status

**Module 10 — Transactions** ✅

This module establishes the fundamentals of transaction management, rollback-based error recovery, database constraints, SQLAlchemy session behavior, and transactional FastAPI operations.

---

## 📚 FastAPI Progress

```text
01 — Basics                    ✅
02 — Project Structure         ✅
03 — Authentication            ✅
04 — Error Handling            ✅
05 — Middleware                ✅
06 — Dependency Injection      ✅
07 — Pydantic + API Design     ✅
08 — SQLAlchemy Relationships  ✅
09 — Testing                   ✅
10 — Transactions              ✅  ← Current
11 — ...
    ↓
17 — Full-Stack Backend        🚀
```
