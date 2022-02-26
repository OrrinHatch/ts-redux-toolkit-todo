import { client } from '../api/client'

export const print1 = (storeAPI) => (next) => (action) => {
    console.log('1')
    return next(action)
}

export const print2 = function(storeAPI) {
    return function(next) {
        return function(action) {
            console.log('2')
            return next(action);
        }
    }
}

export const print3 = (storeAPI) => {
    return (next) => {
        return (action) => {
            console.log('3')
            return next(action);
        }
    }
}

export const loggerMiddleware = (storeAPI) => (next) => (action) => {
    debugger
    console.log('dispatching', action)
    let result = next(action)
    console.log('next state', storeAPI.getState())
    return result;
}

export const delayedMessageMiddleware = storeAPI => next => action => {
    if(action.type=== 'todos/todoAdded') {
        setTimeout(() => {
            console.log('Added a new todo: ', action.payload)
        }, 1000)
        return next(action)
    }
}

export const asyncFunctionMiddleware = storeAPI => next => action => {
    debugger
    // 如果“action”实际上是一个函数.
    if(typeof action === 'function') {
        // 然后调用函数并将 `dispatch` 和 `getState` 作为参数传递
        return action(storeAPI.dispatch, storeAPI.getState)
    }

    // 否则，这是一个正常的action 
    return next(action)
}

export const fetchTodosMiddleware = storeAPI => next => action => {
    if(action.type === 'todos/fetchTodos') {
        // 调用API从服务器获取todos
        client.get('todos').then(todos => {
            // 发送 Action和我们收到的待办事项
            storeAPI.dispatch({ type: 'todos/todosLoaded', payload: todos })
        })

        return next(action)
    }
}