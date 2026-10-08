

function taskReducer(tasks, action){

    if (action.type==="ADD_TASK") {
        return [...tasks, action.payload];
    }
    else if (action.type==="DELETE_TASK") {
        return tasks.filter((task) => task.id !== action.payload);
    }else{
        return tasks;
    }

}

export default taskReducer;