// ============================================================
// JavaScript Fundamentals
// Module 01 — Practice & Examples
// ============================================================


// ------------------------------------------------------------
// 1. Variables
// ------------------------------------------------------------

let name = "Viraj";
let age = 22;
const country = "India";

console.log(name);
console.log(age);
console.log(country);


// ------------------------------------------------------------
// 2. Operators & Type Coercion
// ------------------------------------------------------------

let a = 10;
let b = "10";

console.log(a + b);
console.log(a - b);
console.log(a == b);
console.log(a === b);


// ------------------------------------------------------------
// 3. Conditions & Logical Operators
// ------------------------------------------------------------

let marks = 82;

if (marks >= 90) {
    console.log("Excellent");
} else if (marks >= 75) {
    console.log("Good");
} else if (marks >= 60) {
    console.log("Average");
} else if (marks >= 40) {
    console.log("Pass");
} else {
    console.log("Fail");
}

let isLoggedIn = true;
let isAdmin = false;

if (isLoggedIn && isAdmin) {
    console.log("Access granted");
} else {
    console.log("Access denied");
}


// ------------------------------------------------------------
// 4. Functions
// ------------------------------------------------------------

function isEligible(age, hasLicense) {
    return age >= 18 && hasLicense;
}

console.log(isEligible(22, true));
console.log(isEligible(17, true));
console.log(isEligible(22, false));


// ------------------------------------------------------------
// 5. Arrays — Basics
// ------------------------------------------------------------

const scores = [85, 42, 91, 67, 73];

console.log(scores[0]);
console.log(scores[scores.length - 1]);

scores[1] = 52;
scores.push(88);

console.log(scores);
console.log(scores.length);


// ------------------------------------------------------------
// 6. Arrays — Loops
// ------------------------------------------------------------

const numbers = [10, 20, 30, 40, 50];

for (const number of numbers) {
    console.log(number);
}

let sum = 0;

for (const number of numbers) {
    sum += number;
}

console.log(sum);


// ------------------------------------------------------------
// 7. Arrays — map(), filter(), reduce()
// ------------------------------------------------------------

const prices = [100, 250, 80, 400];

const newPrices = prices.map(price => price * 1.1);

console.log(newPrices);


const values = [10, 25, 42, 7, 18, 31];

const evenNumbers = values.filter(number => number % 2 === 0);

console.log(evenNumbers);


const total = prices.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
);

console.log(total);


// ------------------------------------------------------------
// 8. Arrays + Objects
// ------------------------------------------------------------

const products = [
    { name: "Laptop", price: 800 },
    { name: "Mouse", price: 20 },
    { name: "Keyboard", price: 50 },
    { name: "Monitor", price: 300 }
];

const productNames = products.map(product => product.name);

const expensiveProducts = products.filter(
    product => product.price >= 100
);

const totalPrice = products.reduce(
    (accumulator, product) => accumulator + product.price,
    0
);

console.log(productNames);
console.log(expensiveProducts);
console.log(totalPrice);


// ------------------------------------------------------------
// 9. Destructuring
// ------------------------------------------------------------

const user = {
    name: "Viraj",
    age: 22,
    role: "Developer"
};

const { name: userName, role } = user;

console.log(userName);
console.log(role);


const users = [
    { name: "Viraj", age: 22, role: "Developer" }
];

const [firstUser] = users;

const {
    name: firstUserName,
    role: firstUserRole
} = firstUser;

console.log(firstUserName);
console.log(firstUserRole);


// ------------------------------------------------------------
// 10. Spread Operator
// ------------------------------------------------------------

const originalUser = {
    name: "Viraj",
    age: 22
};

const updatedUser = {
    ...originalUser,
    age: 23,
    role: "Developer"
};

console.log(updatedUser);


const frontend = ["HTML", "CSS"];
const backend = ["Python", "FastAPI"];

const fullStack = [...frontend, ...backend];

console.log(fullStack);


// ------------------------------------------------------------
// 11. Rest Parameters
// ------------------------------------------------------------

function sumNumbers(...numbers) {
    return numbers.reduce(
        (sum, number) => sum + number,
        0
    );
}

console.log(sumNumbers(10, 20, 30));
console.log(sumNumbers(5, 10, 15, 20, 25));


// ------------------------------------------------------------
// 12. Arrow Functions
// ------------------------------------------------------------

const calculateDiscount = (price, discount) =>
    price - (price * discount / 100);

console.log(calculateDiscount(1000, 20));


const calculate = (price, discount) => {
    return price - (price * discount / 100);
};

console.log(calculate(500, 10));


// ------------------------------------------------------------
// 13. Strings
// ------------------------------------------------------------

const text = "JavaScript";

console.log(text.length);
console.log(text.toUpperCase());
console.log(text.toLowerCase());
console.log(text.includes("Script"));


const username = "Viraj Mulik";

console.log(username.length);
console.log(username.toUpperCase());
console.log(username.includes("Viraj"));


const email = "   VIRAJ@GMAIL.COM   ";

const cleanedEmail = email.trim().toLowerCase();

console.log(cleanedEmail);


// ------------------------------------------------------------
// 14. Array Search & Combination Methods
// ------------------------------------------------------------

const scoreList = [85, 72, 91, 64, 78];

const firstAbove80 = scoreList.find(score => score > 80);

const hasBelow60 = scoreList.some(score => score < 60);

const allAtLeast60 = scoreList.every(score => score >= 60);

console.log(firstAbove80);
console.log(hasBelow60);
console.log(allAtLeast60);


const skills = ["HTML", "CSS", "JavaScript", "React"];

const hasReact = skills.includes("React");

const jsIndex = skills.indexOf("JavaScript");

const skillString = skills.join(" | ");

console.log(hasReact);
console.log(jsIndex);
console.log(skillString);


// ------------------------------------------------------------
// 15. Object Property Shorthand
// ------------------------------------------------------------

const developerName = "Viraj";
const developerRole = "Developer";

const developer = {
    name: developerName,
    role: developerRole
};

console.log(developer);


// ------------------------------------------------------------
// 16. Function Scope
// ------------------------------------------------------------

function test() {
    const message = "Hello";

    console.log(message);
}

test();

// console.log(message); // ReferenceError


// ------------------------------------------------------------
// 17. Closures
// ------------------------------------------------------------

function createCounter() {
    let count = 0;

    return function () {
        count++;

        return count;
    };
}

const counterA = createCounter();
const counterB = createCounter();

console.log(counterA());
console.log(counterA());
console.log(counterB());


// ------------------------------------------------------------
// 18. Truthy & Falsy
// ------------------------------------------------------------

console.log(Boolean(0));
console.log(Boolean("hello"));
console.log(Boolean(""));
console.log(Boolean([]));
console.log(Boolean(null));


const usernameValue = "";
const ageValue = 22;

if (usernameValue) {
    console.log("Username exists");
} else {
    console.log("No username");
}

if (ageValue) {
    console.log("Age exists");
} else {
    console.log("No age");
}


// ------------------------------------------------------------
// 19. OR (||) vs Nullish Coalescing (??)
// ------------------------------------------------------------

const displayUsername = "" || "Guest";
const displayAgeWithOr = 0 || 18;
const displayAgeWithNullish = 0 ?? 18;
const displayRole = null ?? "User";

console.log(displayUsername);
console.log(displayAgeWithOr);
console.log(displayAgeWithNullish);
console.log(displayRole);


// ------------------------------------------------------------
// 20. Optional Chaining
// ------------------------------------------------------------

const profileUser = {
    name: "Viraj",

    profile: {
        city: "Pune"
    }
};

console.log(profileUser.profile?.city);
console.log(profileUser.address?.city);


// ------------------------------------------------------------
// 21. Default Parameters
// ------------------------------------------------------------

function greet(name = "Guest") {
    return `Hello ${name}`;
}

console.log(greet());
console.log(greet("Viraj"));