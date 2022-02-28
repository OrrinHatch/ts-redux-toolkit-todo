import React, { MouseEventHandler } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../../store'

import { availableColors, capitalize } from '../filters/colors'
import { StatusFilters, colorFilterChanged, statusFilterChanged } from '../filters/filtersSlice'
import { allTodosCompleted, completedTodosCleared, selectTodos } from '../todos/todosSlice'
import type { ChangeType } from '../filters/filtersSlice'
import type { Color } from '../type'

const CompletedTodos = ({onAllCompleted, onClear}: {onAllCompleted: MouseEventHandler, onClear: MouseEventHandler }) => {
  return (
    <div className="actions">
      <h5>Actions</h5>
      <button className="button" onClick={onAllCompleted}>标记全部完成</button>
      <button className="button" onClick={onClear}>清除已完成</button>
    </div>
  )
}

const RemainingTodos = ({ count }: { count: number}) => {
  
    return (
      <div className="todo-count">
        <h5>剩余的待办事项</h5>
        还剩<strong>{count}</strong> 件待办
      </div>
    )
  }

  const StatusFilter = ({ value: status, onChange }: {value: string; onChange: (status: StatusFilters) => void}) => {
    const renderedFilters = Object.keys(StatusFilters).map((key) => {
      const value = StatusFilters[key as keyof typeof StatusFilters]
      const handleClick = () => onChange(value)
      const className = value === status ? 'selected' : ''
  
      return (
        <li key={value}>
          <button className={className} onClick={handleClick}>
            {value}
          </button>
        </li>
      )
    })
  
    return (
      <div className="filters statusFilters">
        <h5>按状态过滤</h5>
        <ul>{renderedFilters}</ul>
      </div>
    )
  }

  const ColorFilters = ({ value: colors, onChange }: {value: string[]; onChange: (color: Color, changeType: ChangeType) => void}) => {
    const renderedColors = availableColors.map((color) => {
      const checked = colors.includes(color)
      const handleChange = () => {
        const changeType = checked ? 'removed' : 'added'
        onChange(color, changeType)
      }
  
      return (
        <label key={color}>
          <input
            type="checkbox"
            name={color}
            checked={checked}
            onChange={handleChange}
          />
          <span
            className="color-block"
            style={{
              backgroundColor: color,
            }}
          ></span>
          {capitalize(color)}
        </label>
      )
    })
  
    return (
      <div className="filters colorFilters">
        <h5>按颜色过滤</h5>
        <form className="colorSelection">{renderedColors}</form>
      </div>
    )
  }

  const Footer = () => {
    const dispatch = useDispatch()

    const todosRemaining = useSelector((state: RootState) => {

      const uncompletedTodos = selectTodos(state).filter((todo) => !todo.completed)

      return uncompletedTodos.length
  
    })

    const { status, colors } = useSelector((state:any) => state.filters)

    const onMarkCompletedClicked = () => dispatch(allTodosCompleted())
    const onClearCompletedClicked = () => dispatch(completedTodosCleared())

    const onStatusChange = (status: StatusFilters) => 
      dispatch(statusFilterChanged(status))

    const onColorChange = (color: Color, changeType: ChangeType) => {
      dispatch(colorFilterChanged(color, changeType))
    }
  
    return (
      <footer className="footer">
        <CompletedTodos onAllCompleted={onMarkCompletedClicked} onClear={onClearCompletedClicked} />
        <RemainingTodos count={todosRemaining} />
        <StatusFilter value={status} onChange={onStatusChange} />
        <ColorFilters value={colors} onChange={onColorChange} />
      </footer>
    )
  }
  
  export default Footer