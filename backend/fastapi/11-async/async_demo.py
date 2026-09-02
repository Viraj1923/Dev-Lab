import asyncio
import time


async def task(name, delay):
    print(f"{name} started")

    time.sleep(delay)

    print(f"{name} finished")


async def main():

    start = time.perf_counter()

    await task("A", 2)
    await task("B", 2)

    print("Sequential:", round(time.perf_counter() - start, 2))


    start = time.perf_counter()

    await asyncio.gather(
        task("A", 2),
        task("B", 2)
    )

    print("Concurrent:", round(time.perf_counter() - start, 2))


asyncio.run(main())