// Modern JavaScript

// 1. Ternary Operator

const marks = 82;

let result = marks >= 40 ? "Pass" : "Fail";

console.log(result);


// 2. Short-Circuiting with &&

const isLoggedIn = true;

const message = isLoggedIn && "Welcome back!";

console.log(message);


// 3. Nullish Coalescing (??)

const username = null;

const displayName = username ?? "Guest";

console.log(displayName);


// 4. Default Parameters

function calculatePrice(price, tax = 0.18) {
    return price + price * tax;
}

console.log(calculatePrice(100));
console.log(calculatePrice(100, 0.10));


// 5. Destructuring

const user = {
    name: "Viraj",
    age: 22,
    city: "Pune"
};

const { name, city } = user;

console.log(name);
console.log(city);


// 6. Destructuring with Renaming

const { name: username2, age: userAge } = user;

console.log(username2);
console.log(userAge);


// 7. Destructuring in Function Parameters

function showUser({ name, age }) {
    console.log(`${name} is ${age} years old`);
}

showUser(user);


// 8. Spread Operator

const updatedUser = {
    ...user,
    age: 23
};

console.log(updatedUser);


// 9. Rest Parameter

function printNumbers(first, ...rest) {
    console.log(first);
    console.log(rest);
}

printNumbers(10, 20, 30, 40);