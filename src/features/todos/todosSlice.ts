import { AnyAction } from 'redux';
import { createSelector } from 'reselect'

import { client } from '../../api/client';
import  type { AppDispatch, RootState }  from '../../store'
import { StatusFilters } from '../filters/filtersSlice';
export enum Status {
    idle = 'idle', // 未开始 闲置状态
    loading = 'loading', // 进行中
    succeeded = 'succeeded', // 成功
    failed = 'failed' // 失败的
}

export interface Item {
    id: number,
    text: string,
    completed: boolean,
    color?: 'green' | 'blue' | 'orange' | 'purple'| 'red'
}


type Entities<Type> = {
    [ key: number]: Type
}
export interface TodoState {
    status: Status, 
    entities: Entities<Item>
}

const initialState = {
    status: Status.idle,
    entities: {}
} as TodoState

export default function todoReducer(state = initialState, action: AnyAction) {
    switch(action.type) {
        case 'todos/todosLoading': {
            return {
                ...state,
                status: Status.loading
            }
        }
        case 'todos/todosLoaded': {
            // 通过返回新值完全替换现有状态
            return {
                ...state,
                status: Status.idle,
                entities: action.payload
            }
        }
        case 'todos/todoAdded': {
            const todo = action.payload
            // 返回一个新的 todos 状态数组，最后有新的 todo 项
            return {
                ...state,
                entities: {
                    ...state.entities,
                    [todo.id]: todo
                }
            }
        }
        case 'todos/todoToggled': {
            const todoId = action.payload
            const todo =  state.entities[todoId]
            return {
                ...state,
                entities: {
                    ...state.entities,
                    [todoId]: {
                        ...todo,
                        completed: !todo.completed
                    }
                }
            }
        }
        case 'todos/colorSelected': {
            const { color, todoId } = action.payload
            const todo = state.entities[todoId]
            return {
                ...state,
                entities: {
                    ...state.entities,
                    [todoId]: {
                        ...todo,
                        color
                    }
                }
            }
        }
        case 'todos/todoDeleted': {
            const newEntities = { ...state.entities },
                  todoId = action.payload
            delete newEntities[todoId]
            return {
                ...state,
                entities: newEntities
            }
        }
        case 'todos/allCompleted': {
            const newEntities = { ...state.entities }
            Object.values(newEntities).forEach(todo => {
                newEntities[todo.id] = {
                    ...todo,
                    completed: true
                }
            })

            return {
                ...state,
                entities: newEntities
            }
        }
        case 'todos/completedCleared': {
            const newEntities = { ...state.entities }
            Object.values(newEntities).forEach(todo => {
                if(todo.completed) {
                    delete newEntities[todo.id]
                }
            })
            return {
                ...state,
                entities: newEntities
            }
        }
        default: 
            // 如果这个reducer不能识别action, 或者没有
            // 关心这个具体的动作,原样返回现有状态
            return state
    }
}
// 从服务器加载状态
export const todosLoading = () => ({ type: 'todos/todosLoading' })

// 从服务器加载待办事项列表 
export const todosLoaded = (todos: Item[]) => ({ type: 'todos/todosLoaded', payload: todos})

// 保存到服务器后添加新的待办事项。
export const todoAdded = (todo: Item) => ({ type: 'todos/todoAdded', payload: todo })

// 改变待办事项的状态 "已完成" | “未完成”
export const todoToggled = (todoId: number) => ({ type: 'todos/todoToggled', payload: todoId})

// 改变待办事项的颜色属性
export const colorSelected = (todoId: number) => ({ type: 'todos/colorSelected', payload: todoId})

const selectTodoEntities = (state: ReturnType<RootState>): Entities<Item> => state.todos.entities

export const selectTodos = createSelector(selectTodoEntities, (entities) => Object.values(entities))

export const selectTodoById = (state: ReturnType<RootState>, todoId: number) => {
    return selectTodoEntities(state)[todoId]
}

export const selectTodoIds = createSelector(
    // 首先，传递一个或多个“输入选择器”函数：
    selectTodos,
    // 然后，一个“输出选择器”接收所有输入结果作为参数
    // 并返回最终结果值
    (todos) => todos.map(todo => todo.id)
)

export const selectFilteredTodos = createSelector(
    // 第一个输入选择器: 所有待办事项
    selectTodos,
    // 第二个输入选择器: 所有 state filter
    (state: ReturnType<RootState>) => state.filters,
    // 输出选择器: 接收两个值
    (todos, filters) => {
        const { status, colors } = filters
        const showAllcompetions = status === StatusFilters.All
        if(showAllcompetions && colors.length === 0) {
            return todos
        }

        const completedStatus = status === StatusFilters.Completed
        // 基于 filter 返回 active or completed 状态的待办事项
        return todos.filter((todo) =>{
            const statusMatches = 
                showAllcompetions || todo.completed === completedStatus
            const colorMatches = colors.length === 0 || colors.includes(todo.color || '')
            return statusMatches && colorMatches
        })
    }
)

export const selectFilteredTodoIds = createSelector(
    // 将我们的其他 memoized 选择器作为输入传递
    selectFilteredTodos,
    // 并在输出选择器中导出数据
    (filteredTodos: Item[]) => filteredTodos.map(todo => todo.id)
)


// Thunk function
export const fetchTodos = async (dispatch: AppDispatch, getState: RootState) => {
    dispatch(todosLoading())

    const response = await client.get('/fakeApi/todos')

    dispatch(todosLoaded(response.todos));
}

// 编写一个接收`text`参数的同步外部函数：
export function saveNewTodo(text: string) {
    // 然后创建并返回异步 thunk 函数：
    return async function saveNewTodoThunk(dispatch: AppDispatch, getState: RootState) {
        // ✅ 现在我们可以使用文本值并将其发送到服务器
        const initialTodo = { text }
        const response = await client.post('/fakeApi/todos', { todo: initialTodo })
        dispatch(todoAdded(response.todo))
    }
}
