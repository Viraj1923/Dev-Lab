import { useReducer } from "react";

function reducer(count, action) {
    if (action.type === "increment") {
        return count + 1;
    }

    if (action.type === "decrement") {
        return count - 1;
    }

    return count;
}

function Counter() {
    const [count, dispatch] = useReducer(reducer, 0);

    return (
        <div>
            <p>{count}</p>
            <button onClick={() => dispatch({ type: "increment" })}>
                Increment
            </button>
            <button onClick={() => dispatch({ type: "decrement" })}>
                Decrement
            </button>
        </div>
    );
}

export default Counter;