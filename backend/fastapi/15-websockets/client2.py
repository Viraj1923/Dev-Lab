import asyncio
import websockets


async def main():

    # Connect to the same WebSocket endpoint.
    # This creates a separate connection from Client 1.
    async with websockets.connect(
        "ws://127.0.0.1:8000/ws/chat"
    ) as websocket:

        # Client 2 waits for messages from the server.
        while True:

            # Wait until the server broadcasts a message.
            message = await websocket.recv()

            # Display the message received by Client 2.
            print("Client 2:", message)


# Start the async main() function.
asyncio.run(main())
