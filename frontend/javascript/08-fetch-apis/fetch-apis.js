// Fetch & Working with APIs


// 1. Basic GET Request

async function getUsers() {
    try {
        const response = await fetch(
            "https://jsonplaceholder.typicode.com/users"
        );

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const users = await response.json();

        console.log(users);
    } catch (error) {
        console.log(error.message);
    }
}

getUsers();


// 2. Getting Specific Data

async function getFirstUser() {
    try {
        const response = await fetch(
            "https://jsonplaceholder.typicode.com/users"
        );

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const users = await response.json();

        console.log(users[0].name);
    } catch (error) {
        console.log(error.message);
    }
}

getFirstUser();


// 3. GET with Query Parameters

async function getUserById(userId) {
    try {
        const params = new URLSearchParams({
            id: userId
        });

        const response = await fetch(
            `https://jsonplaceholder.typicode.com/users?${params}`
        );

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const users = await response.json();

        console.log(users[0]);
    } catch (error) {
        console.log(error.message);
    }
}

getUserById(3);


// 4. POST Request

async function createUser() {
    try {
        const response = await fetch(
            "https://jsonplaceholder.typicode.com/users",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: "Viraj",
                    email: "viraj@example.com"
                })
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();

        console.log(data);
    } catch (error) {
        console.log(error.message);
    }
}

createUser();