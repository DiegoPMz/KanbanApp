import './addNewTask.css'

import { useContext } from 'react'
import MenuContext from '../../context/MenuContext'
import { AddNewTaskForm } from '../addNewTaskForm/AddNewTaskForm'

export const AddNewTask = () => {
  const { closeModalNewTask } = useContext(MenuContext)

  return (
    <div
      onClick={(e) => closeModalNewTask(e)}
      className='addNewTask-container'>
      <div className='addNewTask'>
        <span className='addNewTask__title'>Add New Task</span>
        <AddNewTaskForm />
      </div>
    </div>
  )
}
