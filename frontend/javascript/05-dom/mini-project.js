const form = document.querySelector("#userForm");
const nameInput = document.querySelector("#name");
const ageInput = document.querySelector("#age");
const usersContainer = document.querySelector("#users");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = nameInput.value;
    const age = ageInput.value;

    const card = document.createElement("div");
    card.innerHTML = `<strong>${name}</strong><br>Age: ${age}`;

    usersContainer.appendChild(card);
    
    // Optional: clear the inputs after submission
    form.reset();
});