# 🔌 FastAPI — WebSockets

> **Module 15** of the FastAPI learning series.

This module introduces **WebSockets in FastAPI** and builds from a simple persistent client-server connection to a multi-client chat server.

The examples demonstrate:

- 🔌 Opening a WebSocket connection
- 🤝 Accepting the WebSocket handshake
- 📤 Sending messages from a client
- 📥 Receiving messages on the server
- 🔄 Keeping a connection alive with an async loop
- 📡 Broadcasting messages to multiple connected clients
- 🧑‍🤝‍🧑 Managing active client connections
- 🛑 Handling `WebSocketDisconnect`
- 🐍 Building async Python WebSocket clients with the `websockets` package
- 💬 Creating a simple in-memory chat server

---

# 🎯 What This Module Teaches

A normal HTTP request follows a short-lived request/response pattern:

```text
Client
  │
  │ HTTP Request
  ▼
FastAPI
  │
  │ HTTP Response
  ▼
Client
```

A WebSocket connection is persistent:

```text
Client
  │
  │ WebSocket Handshake
  ▼
FastAPI
  │
  │ Persistent Connection
  │◄──────────────────►│
  │   messages both ways
  │◄──────────────────►│
  │
  │ connection remains open
  │
```

The module then extends this into a multi-client architecture:

```text
                 ┌─────────────┐
                 │   Client 1  │
                 └──────┬──────┘
                        │
                        ▼
                 ┌─────────────┐
                 │             │
                 │  FastAPI    │
                 │ WebSocket   │
                 │   Server    │
                 │             │
                 └──────┬──────┘
                        │
                        ▼
                 ┌─────────────┐
                 │   Client 2  │
                 └─────────────┘
```

---

# 📁 Project Structure

```text
15-websockets/
│
├── websocket_client.py
├── websocket_demo.py
├── chat_server.py
├── client1.py
└── client2.py
```

### File responsibilities

| File | Purpose |
|---|---|
| `websocket_demo.py` | Basic WebSocket server with connection management |
| `websocket_client.py` | Simple async WebSocket client |
| `chat_server.py` | Chat-oriented WebSocket server |
| `client1.py` | Client 1 for the chat server |
| `client2.py` | Client 2 for the chat server |

---

# 1. 🔌 WebSocket Route

FastAPI provides the `WebSocket` class and the `@app.websocket()` decorator.

The basic server uses:

```python
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    ...
```

Unlike a normal HTTP route such as:

```python
@app.get("/hello")
```

a WebSocket endpoint uses:

```python
@app.websocket("/ws")
```

The client connects using:

```text
ws://127.0.0.1:8000/ws
```

---

# 2. 🤝 Accepting the Connection

A WebSocket connection must first be accepted.

The example uses:

```python
await websocket.accept()
```

This is handled inside:

```python
async def connect(self, websocket: WebSocket):
    await websocket.accept()
```

The connection manager then stores the socket:

```python
self.active_connections.append(websocket)
```

So connection establishment is:

```text
Client
  ↓
WebSocket connection request
  ↓
websocket.accept()
  ↓
Connection established
  ↓
Store active connection
```

---

# 3. 🧑‍🤝‍🧑 ConnectionManager

The module introduces a `ConnectionManager` class.

```python
class ConnectionManager:
```

Its purpose is to keep track of connected clients.

It maintains:

```python
self.active_connections = []
```

This list contains the currently active WebSocket connections.

The manager provides three main operations:

```text
connect()
   ↓
Add connection

disconnect()
   ↓
Remove connection

broadcast()
   ↓
Send message to all connections
```

---

# 4. ➕ Connecting a Client

The `connect()` method is:

```python
async def connect(self, websocket: WebSocket):
    await websocket.accept()
    self.active_connections.append(websocket)
```

Two things happen:

1. The WebSocket handshake is accepted.
2. The connection is added to the active connection list.

This means the server can later find the socket and send data through it.

---

# 5. ➖ Disconnecting a Client

The manager provides:

```python
def disconnect(self, websocket: WebSocket):
    self.active_connections.remove(websocket)
```

When a client disconnects, its socket is removed from the list.

This is important because the server should stop treating a closed connection as active.

---

# 6. 📥 Receiving Messages

The server continuously waits for messages:

```python
while True:
    message = await websocket.receive_json()
```

`receive_json()` waits asynchronously for the next incoming JSON message.

For example, a client can send:

```json
{
  "text": "Hello"
}
```

The server receives the JSON data as a Python object.

---

# 7. 🔄 Persistent Connection

A key difference between HTTP and WebSockets is that the server does not handle just one request and finish.

The example uses:

```python
while True:
```

to continuously wait for incoming messages:

```python
while True:
    message = await websocket.receive_json()
```

Conceptually:

```text
Connect
   ↓
Accept
   ↓
Wait for message
   ↓
Process message
   ↓
Wait for next message
   ↓
Process message
   ↓
...
   ↓
Disconnect
```

The same WebSocket connection can therefore carry multiple messages.

---

# 8. 📡 Broadcasting

The `ConnectionManager` contains:

```python
async def broadcast(self, message: dict):
    for connection in self.active_connections:
        await connection.send_json(message)
```

The server loops over every active connection and sends the same JSON payload to each one.

This is the basic mechanism behind the chat example.

```text
                 Message
                    │
                    ▼
             ConnectionManager
                    │
          ┌─────────┼─────────┐
          ▼         ▼         ▼
       Client 1  Client 2  Client 3
```

---

# 9. 💬 Chat Server

`chat_server.py` builds a chat-specific version of the connection manager.

The WebSocket endpoint is:

```python
@app.websocket("/ws/chat")
async def websocket_endpoint(websocket: WebSocket):
```

Clients connect using:

```text
ws://127.0.0.1:8000/ws/chat
```

---

# 10. 📦 Chat Message Format

The chat server receives JSON:

```python
data = await websocket.receive_json()
```

and wraps it inside:

```python
payload = {"message": data}
```

For example, if a client sends:

```json
{
  "text": "Hello from Client 1"
}
```

the server broadcasts:

```json
{
  "message": {
    "text": "Hello from Client 1"
  }
}
```

The message structure is therefore:

```text
Client JSON
    ↓
receive_json()
    ↓
{"text": "..."}
    ↓
{"message": {"text": "..."}}
    ↓
broadcast()
```

---

# 11. 🧑 Client 1

`client1.py` connects to:

```text
ws://127.0.0.1:8000/ws/chat
```

using:

```python
async with websockets.connect(
    "ws://127.0.0.1:8000/ws/chat"
) as websocket:
```

It then sends:

```json
{
  "text": "Hello from Client 1"
}
```

using:

```python
await websocket.send(
    '{"text": "Hello from Client 1"}'
)
```

After sending the message, Client 1 continuously waits for messages:

```python
while True:
    message = await websocket.recv()
```

and prints:

```python
print("Client 1:", message)
```

---

# 12. 🧑 Client 2

`client2.py` connects to the same endpoint:

```text
ws://127.0.0.1:8000/ws/chat
```

Unlike Client 1, it does not send an initial message.

Instead, it continuously waits:

```python
while True:
    message = await websocket.recv()
```

and displays whatever the server broadcasts:

```python
print("Client 2:", message)
```

This makes Client 2 useful for observing the broadcast behavior.

---

# 13. 🔗 Same Server, Multiple Clients

The two clients demonstrate how multiple WebSocket connections can coexist.

```text
Client 1
   │
   │ {"text": "Hello from Client 1"}
   ▼
FastAPI /ws/chat
   │
   ▼
ConnectionManager
   │
   ├──────────────► Client 1
   │
   └──────────────► Client 2
```

The server sends the broadcast to every connection currently stored in:

```python
active_connections
```

---

# 14. 🛑 Handling Disconnects

WebSocket clients can disconnect at any time.

The examples handle this with:

```python
except WebSocketDisconnect:
```

For example:

```python
except WebSocketDisconnect:
    manager.disconnect(websocket)
```

The disconnect flow is:

```text
Client closes connection
        ↓
WebSocketDisconnect
        ↓
except block
        ↓
manager.disconnect()
        ↓
Remove socket from active list
```

This prevents the server from continuing to treat the disconnected socket as active.

---

# 15. 🧹 Graceful Disconnect

The chat server handles disconnects without allowing an unhandled exception to terminate the endpoint.

In `chat_server.py`:

```python
except WebSocketDisconnect:
    manager.disconnect(websocket)
```

In `websocket_demo.py`, it additionally prints:

```python
print("Client disconnected")
```

This makes the disconnect visible in the server terminal.

---

# 16. 🐍 Python WebSocket Client

The examples use the `websockets` package for Python clients:

```python
import websockets
```

The client runs asynchronously with:

```python
asyncio.run(main())
```

A connection is opened with:

```python
async with websockets.connect("ws://127.0.0.1:8000/ws") as websocket:
```

This gives the client a persistent WebSocket object for sending and receiving messages.

---

# 17. 📤 Sending Messages from the Client

`websocket_client.py` demonstrates sending multiple messages through the **same connection**:

```python
for message in ["Hello", "How are you?", "Bye"]:
    await websocket.send(message)
    response = await websocket.recv()
```

The sequence is:

```text
Open ONE WebSocket connection
        ↓
Send "Hello"
        ↓
Receive response
        ↓
Send "How are you?"
        ↓
Receive response
        ↓
Send "Bye"
        ↓
Receive response
        ↓
Connection closes
```

The important point is that the client does not create a new connection for every message.

---

# 18. 🔁 Request/Response over WebSocket

The simple `websocket_client.py` follows a repeated send/receive pattern:

```python
await websocket.send(message)
response = await websocket.recv()
```

This is different from the chat clients, which can remain waiting for server broadcasts.

### Simple client

```text
Client → Server
       ← Response

Client → Server
       ← Response
```

### Chat clients

```text
Client → Server
           ↓
       Broadcast
        ↙     ↘
   Client 1  Client 2
```

---

# 19. 🧪 Running the Basic WebSocket Demo

From the module directory, start:

```bash
uvicorn websocket_demo:app --reload
```

The WebSocket endpoint is:

```text
ws://127.0.0.1:8000/ws
```

Then run:

```bash
python websocket_client.py
```

The client sends:

```text
Hello
How are you?
Bye
```

and waits for the corresponding server responses.

---

# 20. 🧪 Running the Chat Demo

Start the chat server:

```bash
uvicorn chat_server:app --reload
```

The endpoint is:

```text
ws://127.0.0.1:8000/ws/chat
```

Open two terminals.

### Terminal 1

```bash
python client1.py
```

### Terminal 2

```bash
python client2.py
```

Client 1 sends:

```json
{
  "text": "Hello from Client 1"
}
```

The server broadcasts the resulting payload to every active client.

---

# 21. 🧪 Observing the Broadcast

With both clients connected:

```text
Client 1 ──────────┐
                   │
                   ▼
              Chat Server
                   │
              broadcast()
                ↙     ↘
               ▼       ▼
          Client 1   Client 2
```

Client 1 receives its own broadcast, while Client 2 receives the same broadcast from the server.

This demonstrates the fundamental idea of a simple WebSocket chat room.

---

# 22. 🔌 `ws://` Protocol

The clients use URLs such as:

```text
ws://127.0.0.1:8000/ws
```

and:

```text
ws://127.0.0.1:8000/ws/chat
```

`ws://` indicates the WebSocket protocol.

The examples therefore use:

```text
HTTP server
   ↓
WebSocket upgrade
   ↓
ws:// connection
   ↓
Persistent communication
```

---

# 23. 📊 WebSocket API Comparison

| Operation | FastAPI Server | Python Client |
|---|---|---|
| Open connection | `@app.websocket()` | `websockets.connect()` |
| Accept connection | `websocket.accept()` | — |
| Receive JSON | `receive_json()` | — |
| Send JSON | `send_json()` | — |
| Send message | — | `websocket.send()` |
| Receive message | — | `websocket.recv()` |
| Handle disconnect | `WebSocketDisconnect` | Context manager closes connection |
| Keep connection active | `while True` | `while True` where required |

---

# 24. 🧠 HTTP vs WebSocket

The module makes the persistent nature of WebSockets clear.

### HTTP

```text
Request
  ↓
Response
  ↓
Connection/request cycle ends
```

### WebSocket

```text
Connection
    ↓
Persistent channel
    ↓
Message
    ↓
Message
    ↓
Message
    ↓
...
    ↓
Disconnect
```

WebSockets are therefore useful for communication where the server and client need to exchange messages over an ongoing connection.

---

# 25. 🧩 Complete Chat Architecture

The final chat architecture can be summarized as:

```text
                  ┌──────────────────┐
                  │   FastAPI App    │
                  │                  │
                  │ /ws/chat         │
                  │                  │
                  │ ConnectionManager│
                  └────────┬─────────┘
                           │
                 active_connections
                           │
              ┌────────────┴────────────┐
              │                         │
              ▼                         ▼
        ┌───────────┐             ┌───────────┐
        │  Client 1 │             │  Client 2 │
        │           │             │           │
        │ send()    │             │ recv()    │
        │ recv()    │             │ recv()    │
        └───────────┘             └───────────┘
```

When Client 1 sends a message:

```text
Client 1
   │
   │ send()
   ▼
Server
   │
   │ receive_json()
   ▼
payload
   │
   │ broadcast()
   ├──────────► Client 1
   │
   └──────────► Client 2
```

---

# ⚠️ Important Implementation Notes

This module intentionally uses an **in-memory list**:

```python
self.active_connections = []
```

for connection management.

That means the examples demonstrate the core mechanics of WebSocket connections and broadcasting without introducing an external connection store.

The chat server also broadcasts by iterating through:

```python
self.active_connections
```

and calling:

```python
await connection.send_json(data)
```

This is a learning-oriented implementation of a simple chat server.

---

# 🧪 Suggested Experiments

Once the examples are running, useful experiments include:

### Experiment 1 — Connect one client

Start the server and run:

```bash
python client1.py
```

Observe the connection and message flow.

### Experiment 2 — Connect two clients

Run both:

```bash
python client1.py
python client2.py
```

Observe that Client 2 receives Client 1's broadcast.

### Experiment 3 — Disconnect a client

Stop one client and observe:

```text
WebSocketDisconnect
```

and the connection being removed from the manager.

### Experiment 4 — Send multiple messages

Modify the client message list in `websocket_client.py`:

```python
["Hello", "How are you?", "Bye"]
```

and observe the repeated communication over the same WebSocket connection.

---

# 🧠 Key Takeaways

### 🔌 WebSocket Fundamentals

- WebSockets create persistent connections between clients and servers.
- FastAPI exposes WebSocket routes with `@app.websocket()`.
- The server accepts the connection with `await websocket.accept()`.

### 📥 Receiving

- `receive_json()` waits for and deserializes incoming JSON data.
- A `while True` loop keeps the server listening for additional messages.

### 📤 Sending

- `send_json()` sends Python data as JSON through the WebSocket.
- Python clients use `websocket.send()` to transmit messages.
- Python clients use `websocket.recv()` to wait for incoming messages.

### 🧑‍🤝‍🧑 Connection Management

- `ConnectionManager` keeps track of active connections.
- `connect()` accepts and stores sockets.
- `disconnect()` removes closed sockets.
- `broadcast()` sends data to every active connection.

### 🛑 Disconnect Handling

- `WebSocketDisconnect` is used to detect a closed WebSocket.
- The connection is removed from the manager when the client disconnects.

### 💬 Chat

The chat example combines everything:

```text
Connect
  ↓
Register connection
  ↓
Receive JSON
  ↓
Build payload
  ↓
Broadcast
  ↓
All connected clients receive it
  ↓
Continue listening
  ↓
Disconnect
```

---

# 🏁 Module Status

**Module 15 — WebSockets** ✅

This module establishes the fundamentals of persistent WebSocket communication in FastAPI and progresses to a multi-client broadcast/chat implementation using an in-memory connection manager.

---

## 📚 FastAPI Progress

```text
01 — Basics                     ✅
02 — Project Structure          ✅
03 — Authentication             ✅
04 — Error Handling             ✅
05 — Middleware                 ✅
06 — Dependency Injection       ✅
07 — Pydantic + API Design      ✅
08 — SQLAlchemy Relationships   ✅
09 — Testing                    ✅
10 — Transactions               ✅
11 — Async & Await              ✅
12 — Configuration & Security   ✅
13 — Background Tasks & Lifespan ✅
14 — File Uploads & Forms       ✅
15 — WebSockets                 ✅  ← Current
16 — ...
     ↓
17 — Full-Stack Backend         🚀
```
