import { useContext } from 'react'
import { IconCross } from '../../assets/IconCross'
import MenuContext from '../../context/MenuContext'

export const EditTaskFormSubsTask = () => {
  const { state, onChangeEditTask, deleteSubtaskEditTask } =
    useContext(MenuContext)

  return (
    <div className='editTaskModal__form-generalSubtask'>
      {state.currentTask.subtasks.map((subtask) => (
        <div
          key={subtask.id}
          className='editTaskModal__form-containerSubtask'>
          <input
            type='text'
            className='editTaskModal__inputs editTaskModal__inputs--subtaskInput'
            name='subTask-editTask'
            value={subtask.content}
            onChange={(e) =>
              onChangeEditTask({ target: e.target, id: subtask.id })
            }
          />
          <button
            onClick={() => deleteSubtaskEditTask(subtask.id)}
            className='editTaskModal__form-btn-deleteSubtask'>
            <IconCross />
          </button>
        </div>
      ))}
    </div>
  )
}
