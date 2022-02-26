import React, { useState, ChangeEvent,KeyboardEvent } from 'react'
import { useDispatch } from 'react-redux'

import { saveNewTodo, Status } from '../todos/todosSlice'

const Header = () => {
    const [text, setText] = useState<string>('')
    const [status, setStatus] = useState(Status.idle)
    const dispatch = useDispatch()

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => setText(e.target.value);

    const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
        const trimmedText = text.trim()
        // 如果用户按下Enter键:
        if(e.key === 'Enter' && trimmedText) {
            // 创建和调度thunk函数本身
            setStatus(Status.loading)
            // 创建 thunk 函数并立即 dispatch it
            // 等待这个 saveNewTodo promise 返回
            await dispatch(saveNewTodo(trimmedText))
            // 并且清除input的文本内容
            setText('')
            setStatus(Status.idle)
        }
    }

    let isLoading = status === Status.loading
    let placeholder = isLoading ? '' : '添加待办'
    let loader = isLoading ? <div className='loader' /> : null

    return (
        <header className='header'>
            <input
                className='new-todo'
                placeholder={placeholder}
                autoFocus={true}
                value={text}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
            />
            {loader}
        </header>
    );
}

export default Header;