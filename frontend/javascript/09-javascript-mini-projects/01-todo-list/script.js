const input = document.querySelector("#taskid");
const button = document.querySelector("#button");
const list = document.querySelector("#list");

function addList() {
    const task = input.value.trim();

    if (task === "") {
        return;
    }

    const newItem = document.createElement("li");
    newItem.innerText = task;

    // Mark task as completed
    newItem.addEventListener("click", () => {
        newItem.classList.toggle("completed");
    });

    // Delete button
    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";

    deleteButton.addEventListener("click", (event) => {
        event.stopPropagation();
        newItem.remove();
    });

    newItem.appendChild(deleteButton);
    list.appendChild(newItem);

    input.value = "";
}

button.addEventListener("click", addList);