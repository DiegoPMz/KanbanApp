import './infoTaskForm.css'

import { useContext } from 'react'
import { IconCheck } from '../../assets/IconCheck'
import MenuContext from '../../context/MenuContext'
import { TaskSingleCheck } from '../taskSingleCheck/TaskSingleCheck'

export const InfoTaskForm = () => {
  const { state, onChangeCompleteTask } = useContext(MenuContext)

  const subtaskComplete = state.currentTask.subtasks.filter(
    (el) => el.status === 'complete',
  ).length

  return (
    <div className='infoTaskModal__subtasks'>
      {state.currentTask.subtasks.length > 0 && (
        <span className='infoTaskModal__completeNumber'>
          {subtaskComplete < state.currentTask.subtasks.length ? (
            `Subtasks (${subtaskComplete} of ${state.currentTask.subtasks.length})`
          ) : (
            <div className='infoTaskModal-substasks__complete'>
              <div className='infoTaskModal-substasks__complete-btn'>
                <IconCheck />
              </div>
              <span className='infoTaskModal-substasks__complete-text'>
                Complete
              </span>
            </div>
          )}
        </span>
      )}
      <form
        id='infoTaskModal-completeTask'
        className='infoTaskModal__subtasksForm'>
        {state.currentTask.subtasks.length > 0 &&
          state.currentTask.subtasks.map((subtask) => (
            <TaskSingleCheck
              key={subtask.id}
              subtask={subtask}
            />
          ))}
      </form>

      <div className='infoTaskModal__container-status'>
        <span className='infoTaskModal__title-status'>Current Status</span>
        <select
          className='infoTaskModal__select-status'
          form='infoTaskModal-completeTask'
          name='task_status'
          value={state.currentTask.status}
          onChange={(e) => onChangeCompleteTask({ target: e.target })}>
          {state.currentBoard[0].boardColumns.map((column) => (
            <option
              key={column.id}
              className='infoTaskModal__option-status'
              value={column.name}>
              {column.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
