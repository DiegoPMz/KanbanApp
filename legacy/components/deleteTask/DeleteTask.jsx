import './deleteTask.css'

import { useContext } from 'react'
import MenuContext from '../../context/MenuContext'
import { DeleteElementsBoard } from '../deleteElementsBoard/DeleteElementsBoard'

export const DeleteTask = () => {
  const { state, showModalDeleteTask, showModalDeleteTaskClose, deleteTask } =
    useContext(MenuContext)

  return (
    <DeleteElementsBoard
      handleCancel={showModalDeleteTask}
      handleCloseModal={showModalDeleteTaskClose}
      handleDelete={deleteTask}>
      <h4>Delete this task?</h4>

      <p>
        Are you sure you want to delete the
        <span className='deleteTask__taskName'>
          ‘{state.currentTask.title}’
        </span>
        task and its subtasks? This action cannot be reversed.
      </p>
    </DeleteElementsBoard>
  )
}
