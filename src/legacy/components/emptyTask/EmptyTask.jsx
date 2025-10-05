import './emptyTask.css'

import { useContext } from 'react'
import MenuContext from '../../context/MenuContext'

export const EmptyTask = () => {
  const { showModalNewTask } = useContext(MenuContext)

  return (
    <div className='kanbanBody__emptyTask'>
      <span className='kanbanBody__emptyTask-message'>
        Empty columns. Create a new task to start.
      </span>
      <button
        onClick={showModalNewTask}
        className='kanbanBody__emptyTask-btnContent'>
        + Add New Task
      </button>
    </div>
  )
}
