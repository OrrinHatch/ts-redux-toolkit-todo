import React, { ChangeEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import  type { RootState }  from '../../store'

import { ReactComponent as TimesSolid } from './times-solid.svg'
import { availableColors, capitalize } from '../filters/colors'

import { selectTodoById, todoToggled } from './todosSlice'

// 解构`props.id` 因为我们只需要ID 
const TodoListItem = ({ id }: { id: number, }) => {

    const dispatch = useDispatch()

    const todo = useSelector((state: ReturnType<RootState>) => selectTodoById(state, id))

    if(todo === undefined) return null;
    
    const { text, completed, color } = todo

    const handleCompletedChanged = () => {
        dispatch(todoToggled(todo.id))
    };

    const handleColorChanged = (e: ChangeEvent<HTMLSelectElement>) => {
        const color = e.target.value
        dispatch({ type: 'todos/colorSelected', payload: { todoId: todo.id,color }})
    }
  
    const onDelete = () => {
        dispatch({ type: 'todos/todoDeleted', payload: todo.id })
      }

    const colorOptions = availableColors.map((c) => (
        <option key={c} value={c}>
            {capitalize(c)}
        </option>
    ));

    return (
        <li>
            <div className='view'>
                <div className='segment label'>
                    <input
                        className='toggle'
                        type='checkbox'
                        checked={completed}
                        onChange={handleCompletedChanged}
                    />
                    <div className='todo-text'>{text}</div>
                </div>
                <div className='segment buttons'>
                    <select
                        className="colorPicker"
                        value={color}
                        style={{ color }}
                        onChange={handleColorChanged}
                    >
                        <option value=""></option>
                        {colorOptions}
                    </select>
                    <button className='destroy' onClick={onDelete}>
                        <TimesSolid />
                    </button>
                </div>
            </div>
        </li>
    )
}

export default TodoListItem;