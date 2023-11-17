import './taskListContainer.css'

import { TaskList } from '../taskList/TaskList'

export const TaskListContainer = () => {
  return (
    <div className='taskListContainer'>
      <TaskList />
      <TaskList />
    </div>
  )
}
