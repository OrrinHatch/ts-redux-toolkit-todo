
import React, { useEffect} from 'react'
import { useSelector } from 'react-redux'
import TodoListItem from './TodoListItem'
import { fetchTodos } from '../../features/todos/todosSlice'

import { selectFilteredTodoIds, Status } from './todosSlice'
import { RootState, useAppDispatch } from '../../store'

const TodoList = () => {
    const dispatch = useAppDispatch();

    useEffect(function() {
        dispatch(fetchTodos());
    }, [dispatch]);
    
    const todoIds = useSelector(selectFilteredTodoIds);
    const loadingStatus = useSelector((state: RootState) => state.todos.status)

    if(loadingStatus === Status.loading) {
        return (
            <div className='todo-list'>
                <div className='loader' />
            </div>
        )
    }

    const renderedListItems = todoIds.map((todoId: number) => {
        return <TodoListItem 
            key={todoId}
            id={todoId}
            />
    })

    return <ul className='todo-list'>{ renderedListItems }</ul>
}

export default TodoList;