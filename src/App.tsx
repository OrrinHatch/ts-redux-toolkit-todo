import React from 'react'

import Header from './features/header/Header'
import TodoList from './features/todos/TodoList'
import Footer from './features/footer/Footer'

function App() {
  return (
    <div className='App'>
      <nav>
        <section>
          <h1>Redux 基础示例</h1>
        </section>
      </nav>
      <main>
        <section className='medium-container'>
          <h2>待办事项</h2>
          <div className='todoapp'>
            {/* 包含 “新待办事项” 文本输入和 “完成所有待办事项” 复选框 */}
            <Header/>
            {/* 基于过滤结果的所有当前可见待办事项的列表 */}
            <TodoList/>
            {/* 显示活动待办事项的数量和用于根据已完成状态和颜色类别过滤列表的控件 */}
            <Footer/>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App;