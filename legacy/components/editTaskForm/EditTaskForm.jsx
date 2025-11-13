import './editTaskForm.css'

import { useContext } from 'react'
import MenuContext from '../../context/MenuContext'
import { EditTaskFormSubsTask } from '../EditTaskFormSubsTask/EditTaskFormSubsTask'

export const EditTaskForm = () => {
  const { state, onChangeEditTask, createNewSubtaskEditTask, submitTaskEdit } =
    useContext(MenuContext)

  return (
    <form
      onSubmit={(e) => submitTaskEdit(e)}
      className='editTaskModal__form'
      id='editTaskModal__form'>
      <div className='editTaskModal__form-subContainer'>
        <label
          htmlFor='editTaskModal__title-input'
          className='editTaskModal__labels'>
          Title
        </label>
        <input
          form='editTaskModal__form'
          type='text'
          id='editTaskModal__title-input'
          className='editTaskModal__inputs'
          name='title'
          value={state.currentTask.title}
          onChange={(e) => onChangeEditTask({ target: e.target })}
        />
      </div>
      <div className='editTaskModal__form-subContainer'>
        <label
          htmlFor='editTaskModal__title-description'
          className='editTaskModal__labels'>
          Description
        </label>
        <textarea
          form='editTaskModal__form'
          id='editTaskModal__title-description'
          className='editTaskModal__inputs editTaskModal__description'
          name='description'
          value={state.currentTask.description}
          onChange={(e) => onChangeEditTask({ target: e.target })}
        />
      </div>
      <div className='editTaskModal__form-subContainer'>
        <label className='editTaskModal__labels'>Subtasks</label>

        <EditTaskFormSubsTask />

        <button
          type='button'
          onClick={createNewSubtaskEditTask}
          className='editTaskModal__form-btn editTaskModal__form-btn--newSubtask '>
          + Add New Subtask
        </button>
      </div>

      <button
        type='submit'
        className='editTaskModal__form-btn editTaskModal__form-btn--createTask '>
        Create Task
      </button>
    </form>
  )
}

/* <div className='editTaskModal__form-subContainer'>
        <label
          htmlFor='editTaskModal__title-description'
          className='editTaskModal__labels'>
          Status
        </label>

        <select
          className='editTaskModal__inputs'
          id=''
          name='status'
          value={state.currentTask.status}
          onChange={(e) => onChangeEditTask({ target: e.target })}>
          {state.currentBoard[0].boardColumns.map((column) => (
            <option
              key={column.id}
              value={column.name}
              className='editTaskModal__status-options'>
              {column.name}
            </option>
          ))}
        </select>
      </div> */
