import asyncio
import websockets


async def main():

    # Open one WebSocket connection to the FastAPI server.
    async with websockets.connect(
        "ws://127.0.0.1:8000/ws"
    ) as websocket:

        # Send multiple messages through the SAME connection.
        for message in ["Hello", "How are you?", "Bye"]:

            # Send the current message to the server.
            await websocket.send(message)

            # Wait for the server's response.
            response = await websocket.recv()

            # Print the response.
            print(response)


# Start the async main() function.
asyncio.run(main())
