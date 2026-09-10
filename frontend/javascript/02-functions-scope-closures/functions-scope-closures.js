// ============================================================
// JavaScript — Module 02
// Functions, Scope & Closures
// ============================================================


// ------------------------------------------------------------
// 1. Function Expression
// ------------------------------------------------------------

const calculateSquare = function (number) {
    return number * number;
};

console.log(calculateSquare(5));


// ------------------------------------------------------------
// 2. Callback Functions
// ------------------------------------------------------------

const add = (a, b) => a + b;
const multiply = (a, b) => a * b;


// ------------------------------------------------------------
// 3. Higher-Order Function
// ------------------------------------------------------------

function calculate(a, b, operation) {
    return operation(a, b);
}

console.log(calculate(10, 5, add));       // 15
console.log(calculate(10, 5, multiply));  // 50

// Callback can also be passed directly
console.log(calculate(10, 5, (a, b) => a - b)); // 5


// ------------------------------------------------------------
// 4. Scope
// ------------------------------------------------------------

let x = 10;

function test() {
    let x = 20;

    if (true) {
        let x = 30;
        console.log(x); // 30
    }

    console.log(x); // 20
}

test();

console.log(x); // 10


// ------------------------------------------------------------
// 5. Lexical Scope
// ------------------------------------------------------------

let a = 10;

function outer() {
    let b = 20;

    function inner() {
        let c = 30;

        console.log(a + b + c); // 60
    }

    inner();
}

outer();


// ------------------------------------------------------------
// 6. Closures
// ------------------------------------------------------------

function createGreeting(name) {
    return function () {
        console.log(`Hello ${name}`);
    };
}

const greetViraj = createGreeting("Viraj");

greetViraj();


// ------------------------------------------------------------
// 7. Closure with Private State
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

console.log(counterA()); // 1
console.log(counterA()); // 2
console.log(counterB()); // 1