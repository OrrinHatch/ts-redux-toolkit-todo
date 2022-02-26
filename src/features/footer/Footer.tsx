import React, { MouseEventHandler } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store'

import { availableColors, capitalize } from '../filters/colors'
import { StatusFilters, transformStatus, colorFilterChanged } from '../filters/filtersSlice'
import { selectTodos } from '../todos/todosSlice'

const CompletedTodos = ({onAllCompleted, onClear}: {onAllCompleted: MouseEventHandler, onClear: MouseEventHandler }) => {
  return (
    <div className="actions">
      <h5>Actions</h5>
      <button className="button" onClick={onAllCompleted}>标记全部完成</button>
      <button className="button" onClick={onClear}>清除完成</button>
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


  const StatusFilter = ({ value: status, onChange }: {value: string; onChange: (status: string) => void}) => {
    const renderedFilters = Object.keys(StatusFilters).map((key) => {
      const value = StatusFilters[key as keyof typeof StatusFilters]
      const handleClick = () => onChange(value)
      const className = value === status ? 'selected' : ''
  
      return (
        <li key={value}>
          <button className={className} onClick={handleClick}>
            {transformStatus(key)}
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

  const ColorFilters = ({ value: colors, onChange }: {value: string[]; onChange: (color: string, changeType: 'removed' | 'added') => void}) => {
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

    const todosRemaining = useSelector((state: ReturnType<RootState>) => {

      const uncompletedTodos = selectTodos(state).filter((todo) => !todo.completed)

      return uncompletedTodos.length
  
    })

    const { status, colors } = useSelector((state:any) => state.filters)

    const onMarkCompletedClicked = () => dispatch({ type: 'todos/allCompleted' })
    const onClearCompletedClicked = () => dispatch({ type: 'todos/completedCleared' })

    const onStatusChange = (status: string) => 
      dispatch({ type: 'filters/statusFilterChanged', payload: status})

    const onColorChange = (color: string, changeType: 'removed' | 'added') => {
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