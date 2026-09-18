const textarea = document.querySelector("#characters");
const count = document.querySelector("#count");

textarea.addEventListener("input", () => {
    count.innerText = textarea.value.length;
});