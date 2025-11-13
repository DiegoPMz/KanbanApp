import './editTaskModal.css'

import { useContext } from 'react'
import MenuContext from '../../context/MenuContext'
import { EditTaskForm } from '../editTaskForm/EditTaskForm'

export const EditTaskModal = () => {
  const { closeModalEditTask } = useContext(MenuContext)

  return (
    <div
      onClick={(e) => closeModalEditTask(e)}
      className='editTaskModal__container'>
      <div className='editTaskModal'>
        <span className='editTaskModal_title'>Edit Task</span>
        <EditTaskForm />
      </div>
    </div>
  )
}
