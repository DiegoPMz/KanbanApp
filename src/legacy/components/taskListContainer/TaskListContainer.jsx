import './taskListContainer.css'

import { useContext } from 'react'
import MenuContext from '../../context/MenuContext'
import { TaskList } from '../taskList/TaskList'

export const TaskListContainer = () => {
  const { state } = useContext(MenuContext)

  return (
    <div className='taskListContainer'>
      {state.currentBoard[0].boardColumns.map((column, index) => (
        <TaskList
          key={column.id}
          column={column}
          position={index}
        />
      ))}
    </div>
  )
}
