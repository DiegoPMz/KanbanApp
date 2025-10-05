import './taskSingleCheck.css'

import { useContext } from 'react'
import MenuContext from '../../context/MenuContext'

export const TaskSingleCheck = ({ subtask }) => {
  const { onChangeCompleteTask } = useContext(MenuContext)

  const CLASS_COMPLETE_SUBTASK =
    'subtaskCheck__checkBox subtaskCheck__checkBox--complete'

  const CLASS_COMPLETE_SUB_TEXT =
    'subtaskCheck__subtaskContent subtaskCheck__subtaskContent--complete'

  return (
    <div className=' infoTaskModal__subtasksForm-subtaskCheck '>
      <input
        form='infoTaskModal-completeTask'
        onChange={(e) =>
          onChangeCompleteTask({ target: e.target, id: subtask.id })
        }
        type='checkbox'
        className={
          subtask.status === 'pending'
            ? 'subtaskCheck__checkBox'
            : CLASS_COMPLETE_SUBTASK
        }
        name='subtask_status'
        value={subtask.status}
      />

      <span
        className={
          subtask.status === 'pending'
            ? 'subtaskCheck__subtaskContent'
            : CLASS_COMPLETE_SUB_TEXT
        }>
        {subtask.content}
      </span>
    </div>
  )
}
