import { combineReducers } from "@reduxjs/toolkit";

// import type { TodoState } from "./features/todos/todosSlice";
// import type { FiltersState } from "./features/filters/filtersSlice"

import todoReducer from "./features/todos/todosSlice";
import filtersReducer from "./features/filters/filtersSlice";

const rootReducer = combineReducers({
    // 定义一个名为`todos`的顶级字段, 由`todosReducer`处理
    todos: todoReducer,
    filters: filtersReducer
});

export default rootReducer

// interface AppState {
//     todos: Array<TodoState>,
//     filters: FiltersState
// }

// const initialState: Partial<AppState> = {}

// export default function rootReducer(state = initialState, action: { type: string, payload?: unknown}) {
//     // 总是为root state 返回一个新对象
//     return {
//         todos: todoReducer(state.todos, action),
//         filters: filterReducer(state.filters, action)
//     }
// }




