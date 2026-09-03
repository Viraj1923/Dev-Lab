from fastapi import FastAPI, WebSocket, WebSocketDisconnect

app = FastAPI()


# Manages all currently connected WebSocket clients.
class ConnectionManager:

    def __init__(self):
        # Store every active WebSocket connection here.
        self.active_connections = []

    async def connect(self, websocket: WebSocket):
        # Accept the WebSocket handshake and establish the connection.
        await websocket.accept()

        # Save this client's connection so we can send messages to it.
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        # Remove the client when it disconnects.
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        # Send the message to every currently connected client.
        for connection in self.active_connections:
            await connection.send_json(message)


# Create one manager that keeps track of our WebSocket connections.
manager = ConnectionManager()


# WebSocket route.
# Clients connect using: ws://127.0.0.1:8000/ws
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):

    # Accept this client and add it to the active connections list.
    await manager.connect(websocket)

    try:
        # Keep the connection alive and continuously wait for messages.
        while True:

            # Wait for a JSON message sent by the client.
            # Example: {"text": "Hello"}
            message = await websocket.receive_json()

            # Send the received message to all connected clients.
            await manager.broadcast({
                "message": message,
                "sender": "client"
            })

    except WebSocketDisconnect:
        # Runs when the client closes the WebSocket connection.
        manager.disconnect(websocket)

        # Print this so we can see the disconnect in the server terminal.
        print("Client disconnected")
