// Modules, JSON & Error Handling

// 1. Named Export / Import

// Example from math.js:
// export function add(a, b) {
//     return a + b;
// }

// Import:
// import { add } from "./math.js";


// 2. Default Export / Import

// Example from greet.js:
// export default function greet(name) {
//     return `Hello ${name}`;
// }

// Import:
// import greet from "./greet.js";


// 3. JSON.stringify()
// JavaScript Object → JSON String

const user = {
    name: "Viraj",
    age: 22,
    skills: ["JavaScript", "React"]
};

const jsonData = JSON.stringify(user);

console.log(jsonData);
console.log(typeof jsonData);


// 4. JSON.parse()
// JSON String → JavaScript Object

const parsedUser = JSON.parse(jsonData);

console.log(parsedUser.name);
console.log(parsedUser.skills);


// 5. try...catch

try {
    JSON.parse("invalid json");
} catch (error) {
    console.log(error.message);
}


// 6. throw

function checkAge(age) {
    if (age < 18) {
        throw new Error("Age must be 18 or above");
    }

    return "Access granted";
}

try {
    console.log(checkAge(16));
} catch (error) {
    console.log(error.message);
}


// 7. finally

try {
    console.log("Trying...");
} catch (error) {
    console.log("Error occurred");
} finally {
    console.log("This always runs");
}