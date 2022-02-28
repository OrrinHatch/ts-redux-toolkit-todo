import { configureStore } from '@reduxjs/toolkit';

import todoReducer from "./features/todos/todosSlice";
import filtersReducer from "./features/filters/filtersSlice";
import { useDispatch } from 'react-redux';


const store = configureStore({
    reducer: {
        todos: todoReducer,
        filters: filtersReducer
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
// 导出一个可以重用的钩子来解析类型
export const useAppDispatch = () => useDispatch<AppDispatch>()

export default store;