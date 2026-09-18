const input = document.querySelector("#userid");
const button = document.querySelector("#search");
const display = document.querySelector("#displayinfo");

async function searchUser() { 
    const id = input.value;

    try {
        const response = await fetch(
            `https://jsonplaceholder.typicode.com/users/${id}`
        );

        if (!response.ok) {
            throw new Error(`User not found: ${response.status}`);
        }

        const user = await response.json();

        display.innerHTML = `
            <p>Name: ${user.name}</p>
            <p>Email: ${user.email}</p>
            <p>City: ${user.address.city}</p>
        `;
    } catch (error) {
        display.innerText = error.message;
    }
}

button.addEventListener("click", searchUser);