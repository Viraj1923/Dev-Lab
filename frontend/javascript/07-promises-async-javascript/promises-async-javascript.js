// Promises & Async JavaScript


// 1. Synchronous vs Asynchronous JavaScript

console.log("Start");

setTimeout(() => {
    console.log("Delayed");
}, 2000);

console.log("End");


// 2. Creating a Promise

const promise = new Promise((resolve, reject) => {
    resolve("Data received");
});


// 3. Handling a Promise with .then()

promise.then((result) => {
    console.log(result);
});


// 4. Handling Promise Errors with .catch()

const failedPromise = new Promise((resolve, reject) => {
    reject("Failed to load data");
});

failedPromise.catch((error) => {
    console.log(error);
});


// 5. Promise Chaining

Promise.resolve(5)
    .then((num) => num + 5)
    .then((num) => num * 3)
    .then((num) => console.log(num));


// 6. async / await

const dataPromise = Promise.resolve("Data received");

async function getData() {
    const result = await dataPromise;

    console.log(result);
}

getData();


// 7. async / await with a Delayed Promise

function getUser() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                name: "Viraj",
                age: 22
            });
        }, 1500);
    });
}

async function showUser() {
    try {
        const result = await getUser();

        console.log(result.name);
    } catch (error) {
        console.log(error);
    }
}

showUser();


// 8. async / await with Error Handling

function getFailedData() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject("Failed to load data");
        }, 1000);
    });
}

async function loadData() {
    try {
        const result = await getFailedData();

        console.log(result);
    } catch (error) {
        console.log(error);
    }
}

loadData();

// small exercise
function getUser() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                name: "Viraj",
                age: 22
            });
        }, 1500);
    });
}

async function normal() {
    try {
        const result=await getUser();
        console.log(result.name);
    } catch (error) {
        console.log(error);
    }
}

normal()