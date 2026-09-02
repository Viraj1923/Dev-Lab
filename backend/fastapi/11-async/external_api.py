import asyncio
import httpx


async def fetch_data(client, url):
    print(f"Request started: {url}")

    response = await client.get(url)

    print(f"Request finished: {url}")

    return response.status_code


# async def main():
#     async with httpx.AsyncClient() as client:

#         results = await asyncio.gather(
#             fetch_data(client, "https://httpbin.org/delay/2"),
#             fetch_data(client, "https://httpbin.org/delay/2"),
#         )

#         print(results)


# asyncio.run(main())

async def main():
    async with httpx.AsyncClient() as client:
        results=await asyncio(fetch_data(client,"https://httpbin.org/get"))
        print(results)

asyncio.run(main())