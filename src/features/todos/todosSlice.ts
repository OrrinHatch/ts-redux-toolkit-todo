import { 
    createAsyncThunk,
    createSelector, 
    createSlice, 
    PayloadAction,
    createEntityAdapter,
} from "@reduxjs/toolkit";
import { client } from "../../api/client";
import { RootState } from "../../store";
import { StatusFilters } from "../filters/filtersSlice";
import type { Color } from "../type"

export enum Status {
    idle = 'idle', // 未开始 闲置状态
    loading = 'loading', // 进行中
    succeeded = 'succeeded', // 成功
    failed = 'failed' // 失败的
}

export type Todo =  {
    id: number,
    text: string,
    completed: boolean,
    color?: Color
}

const todosAdapter = createEntityAdapter<Todo>()

const initialState = todosAdapter.getInitialState({
    status: Status.idle,
})

const todosSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {
        todoAdded: todosAdapter.addOne,
        todoToggled(state, action: PayloadAction<number>) {
            const todoId = action.payload
            const todo = state.entities[todoId]
            if(todo) {
                todo.completed = !todo.completed
            }
        },
        todoColorSelected: {
            reducer(state, action: PayloadAction<{id: number, color: Color}>) {
                const { id, color } = action.payload
                const todo = state.entities[id]
                if(todo) {
                    todo.color = color
                }
            },
            prepare(id: number, color: Color) {
              return {
                  payload: {
                    id,
                    color
                  }
              }
            }
        },
        todoDeleted: todosAdapter.removeOne,
        allTodosCompleted(state) {
            Object.values(state.entities).forEach(todo => {
                if(todo) {
                    todo.completed = true
                }
            })
        },
        completedTodosCleared(state) {

            const completedIds = Object.values(state.entities)
                .filter(todo =>  todo && todo.completed)
                .map((todo) => todo && todo.id)
                // 使用适配器函数作为"变异"更新助手
                todosAdapter.removeMany(state, completedIds as number[])
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchTodos.pending, (state) => {
                state.status = Status.loading
            })
            .addCase(fetchTodos.fulfilled, (state, action: PayloadAction<Todo[]>) => {
                todosAdapter.setAll(state, action.payload)
                state.status = Status.idle
            })
            .addCase(saveNewTodo.fulfilled, todosAdapter.addOne)
    }
})

export const { 
    todoAdded, 
    todoToggled, 
    todoColorSelected, 
    todoDeleted,
    allTodosCompleted,
    completedTodosCleared
} = todosSlice.actions

export default todosSlice.reducer

export const { selectAll: selectTodos, selectById: selectTodoById } = todosAdapter.getSelectors((state: RootState) => state.todos)

// Thunk function
export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
    const { todos  } = await client.get('/fakeApi/todos')
    return todos
})

export const saveNewTodo = createAsyncThunk('todos/saveNewTodo', async (text: string) => {
    const initialState = { text }
    const { todo } = await client.post('/fakeApi/todos', { todo: initialState })
    return todo
})


export const selectTodoIds = createSelector(
    // 首先, 传递一个货多个“输入选择器”函数:
    selectTodos,
    // 然后, 一个“输出选择器”接收所有输入结果作为参数
    // 并返回最终结果值
    (todos) => todos.map(todo => todo.id)
)

export const selectFilteredTodos = createSelector(
    // 第一个输入选择器: 所有待办事项
    selectTodos,
    // 第二个输入选择器: 所有 state filter values
    (state: RootState) => state.filters,
    (todos, filters) => {
        const { status, colors } = filters

        const showAllcompetions = status === StatusFilters.all

        if(showAllcompetions && colors.length === 0) {
            return todos
        }

        const completedStatus = status === StatusFilters.completed

        // 基于filter 返回 active or completed 状态的待办事项
        return todos.filter(todo => {
            const statusMatches =
                showAllcompetions || todo.completed === completedStatus
            
            const colorMatches = colors.length === 0 || colors.includes(todo.color as Color)

            return statusMatches && colorMatches
        })
    }
)

export const selectFilteredTodoIds = createSelector(
    // 将我们的其他 memoized 选择器作为输入传递
    selectFilteredTodos,
    // 并在输出选择器中导出数据
    (filteredTodos) => filteredTodos.map(todo => todo.id)
)