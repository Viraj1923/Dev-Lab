// DOM Practice

// 1. Selecting an Element

const heading = document.querySelector("#title");

console.log(heading);


// 2. Changing Text with innerHTML

heading.innerHTML = "Hello Viraj";


// 3. Changing Text with textContent

const message = document.querySelector("#message");

message.textContent = "Welcome to JavaScript";


// 4. Selecting Multiple Elements

const items = document.querySelectorAll(".item");

for (const item of items) {
    console.log(item);
}


// 5. Input Value

const username = document.querySelector("#username");

console.log(username.value);

username.value = "Rahul";


// 6. Changing Styles

message.style.color = "red";


// 7. Creating an Element

const container = document.querySelector("#container");

const paragraph = document.createElement("p");

paragraph.textContent = "Hello DOM";

container.append(paragraph);


// 8. Removing an Element

const elementToRemove = document.querySelector("#removeMe");

elementToRemove.remove();


// 9. DOM Traversal

console.log(paragraph.parentElement);
console.log(container.children);


// 10. classList

message.classList.add("highlight");
message.classList.remove("highlight");


// 11. Click Event

const button = document.querySelector("#btn");

button.addEventListener("click", function () {
    message.textContent = "Button clicked!";
});


// 12. Event Object

button.addEventListener("click", function (event) {
    console.log(event.target);
});


// 13. Input Event

username.addEventListener("input", function (event) {
    console.log(event.target.value);
});


// 14. Form Submission

const form = document.querySelector("#loginForm");

form.addEventListener("submit", function (event) {
    event.preventDefault();

    message.textContent = `Welcome, ${username.value}!`;
});