// ============================================================
// JavaScript — Module 03
// Arrays & Objects
// ============================================================


// ------------------------------------------------------------
// 1. map() — Transform Array of Objects
// ------------------------------------------------------------

const users = [
    { name: "Viraj", age: 22 },
    { name: "Rahul", age: 25 },
    { name: "Amit", age: 19 }
];

const usersCombined = users.map(user => user.name);

console.log(usersCombined);
// ["Viraj", "Rahul", "Amit"]


// Add a new property using object spread
const usersWithAdultStatus = users.map(user => ({
    ...user,
    isAdult: user.age >= 18
}));

console.log(usersWithAdultStatus);


// ------------------------------------------------------------
// 2. filter() + map() — Array of Objects
// ------------------------------------------------------------

const activeUsers = [
    { name: "Viraj", age: 22, active: true },
    { name: "Rahul", age: 17, active: false },
    { name: "Amit", age: 25, active: true },
    { name: "Rohan", age: 30, active: false }
];

const activeAdultNames = activeUsers
    .filter(user => user.age >= 18 && user.active)
    .map(user => user.name);

console.log(activeAdultNames);
// ["Viraj", "Amit"]


// ------------------------------------------------------------
// 3. reduce() — Array of Objects
// ------------------------------------------------------------

const products = [
    { name: "Laptop", price: 800 },
    { name: "Mouse", price: 20 },
    { name: "Keyboard", price: 50 },
    { name: "Monitor", price: 300 }
];

const totalPrice = products.reduce(
    (acc, product) => acc + product.price,
    0
);

console.log(totalPrice);
// 1170


// ------------------------------------------------------------
// 4. Object.entries() — Iterate Over Object
// ------------------------------------------------------------

const user = {
    name: "Viraj",
    age: 22,
    role: "Developer"
};

for (const [key, value] of Object.entries(user)) {
    console.log(`${key} = ${value}`);
}


// ------------------------------------------------------------
// 5. Sorting Array of Objects
// ------------------------------------------------------------

// Ascending — lowest price first
const sortedProducts = [...products]
    .sort((a, b) => a.price - b.price);

console.log(sortedProducts);


// Descending — highest price first
const reverseSortedProducts = [...products]
    .sort((a, b) => b.price - a.price);

console.log(reverseSortedProducts);


// ------------------------------------------------------------
// 6. slice() vs splice()
// ------------------------------------------------------------

const numbers = [10, 20, 30, 40, 50];

// slice() does not change the original array
const part = numbers.slice(1, 4);

console.log(part);
// [20, 30, 40]

console.log(numbers);
// [10, 20, 30, 40, 50]


// splice() changes the original array
const numbersCopy = [...numbers];

const removed = numbersCopy.splice(1, 2);

console.log(removed);
// [20, 30]

console.log(numbersCopy);
// [10, 40, 50]


// ------------------------------------------------------------
// 7. Method Chaining — filter() + map()
// ------------------------------------------------------------

const expensiveProductNames = products
    .filter(product => product.price >= 100)
    .map(product => product.name);

console.log(expensiveProductNames);
// ["Laptop", "Monitor"]


// ------------------------------------------------------------
// 8. filter() + reduce() — Real Data Example
// ------------------------------------------------------------

const categorizedProducts = [
    { name: "Laptop", price: 800, category: "Electronics" },
    { name: "Mouse", price: 20, category: "Electronics" },
    { name: "Keyboard", price: 50, category: "Electronics" },
    { name: "Desk", price: 200, category: "Furniture" }
];

const totalElectronicsPrice = categorizedProducts
    .filter(product => product.category === "Electronics")
    .reduce((acc, product) => acc + product.price, 0);

console.log(totalElectronicsPrice);
// 870


// ------------------------------------------------------------
// 9. Object.keys(), Object.values(), Object.entries()
// ------------------------------------------------------------

const product = {
    name: "Laptop",
    price: 800,
    category: "Electronics"
};

console.log(Object.keys(product));
// ["name", "price", "category"]

console.log(Object.values(product));
// ["Laptop", 800, "Electronics"]

console.log(Object.entries(product));
// [
//     ["name", "Laptop"],
//     ["price", 800],
//     ["category", "Electronics"]
// ]


// ------------------------------------------------------------
// 10. Object → Transform Values → New Object
// ------------------------------------------------------------

const prices = {
    laptop: 800,
    mouse: 20,
    keyboard: 50
};


// Using for...in
const increasedPrices = {};

for (const key in prices) {
    increasedPrices[key] = prices[key] * 1.1;
}

console.log(increasedPrices);
// { laptop: 880, mouse: 22, keyboard: 55 }


// Modern approach using Object.entries()
const newPrices = Object.fromEntries(
    Object.entries(prices).map(([key, value]) => [
        key,
        value * 1.1
    ])
);

console.log(newPrices);
// { laptop: 880, mouse: 22, keyboard: 55 }