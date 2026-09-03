import asyncio
import websockets


async def main():

    # Connect to the FastAPI WebSocket endpoint.
    # ws:// means we are using the WebSocket protocol.
    async with websockets.connect(
        "ws://127.0.0.1:8000/ws/chat"
    ) as websocket:

        # Send a JSON message to the server.
        await websocket.send(
            '{"text": "Hello from Client 1"}'
        )

        # Keep waiting for messages from the server.
        # recv() pauses here until a message arrives.
        while True:
            message = await websocket.recv()

            # Display the message received from the server.
            print("Client 1:", message)


# Start the async main() function.
asyncio.run(main())
