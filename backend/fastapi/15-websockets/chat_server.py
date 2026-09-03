from fastapi import FastAPI, WebSocket, WebSocketDisconnect

app = FastAPI()


class ConnectionManager:
    """
    Manages active WebSocket connections.
    """

    def __init__(self):
        # Keeps an in-memory list of open WebSocket sockets.
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        # Handshake: Upgrade the standard HTTP connection to a persistent WebSocket protocol connection.
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        # Remove the reference so we stop attempting to send frame packets to a dead socket.
        self.active_connections.remove(websocket)

    async def broadcast(self, data: dict):
        # Iterate over active connections and serialize the Python dict to JSON across the wire.
        for connection in self.active_connections:
            await connection.send_json(data)


manager = ConnectionManager()


@app.websocket("/ws/chat")
async def websocket_endpoint(websocket: WebSocket):
    # Step 1: Handshake and register client socket
    await manager.connect(websocket)

    try:
        # Step 2: Keep the TCP socket open in an infinite event loop block
        while True:
            # receive_json() suspends execution until an incoming frame arrives and deserializes it automatically
            data = await websocket.receive_json()

            # Format strictly as {"message": {"text": ...}} per contract specifications
            payload = {"message": data}

            # Step 3: Fan out payload to all connected clients
            await manager.broadcast(payload)

    except WebSocketDisconnect:
        # Step 4: Handle socket closure gracefully without throwing unhandled exceptions
        manager.disconnect(websocket)