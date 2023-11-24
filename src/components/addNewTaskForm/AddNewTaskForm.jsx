import './addNewTaskForm.css'

import { useContext } from 'react'
import { IconChevron } from '../../assets/IconChevron'
import MenuContext from '../../context/menuContext'
import { AddSubTask } from '../addSubTask/AddSubTask'

export const AddNewTaskForm = () => {
  const { state, handleChangeNewTask, handleCreateSubTask, handleSubmitTask } =
    useContext(MenuContext)

  return (
    <form
      id='addNewTaskForm-form'
      className='addNewTaskForm'
      onSubmit={(e) => handleSubmitTask(e)}>
      <div className='addNewTaskForm__container'>
        <label
          className='addNewTaskForm__label'
          htmlFor='addNewTaskForm-input-title'>
          Title
        </label>
        <input
          form='addNewTaskForm-form'
          id='addNewTaskForm-input-title'
          placeholder='e.g. Take coffee break'
          className='addNewTaskForm__input'
          type='text'
          name='title'
          value={state.newTask.title}
          onChange={(e) => handleChangeNewTask({ e })}
        />
      </div>
      <div className='addNewTaskForm__container  '>
        <label
          className='addNewTaskForm__label'
          htmlFor='addNewTaskForm-textarea-description'>
          Description
        </label>
        <textarea
          placeholder='e.g. It’s always good to take a break. This 15 minute break will  recharge the batteries a little.'
          id='addNewTaskForm-textarea-description'
          form='addNewTaskForm-form'
          className='addNewTaskForm__input addNewTaskForm__text-area'
          type='text'
          name='description'
          value={state.newTask.description}
          onChange={(e) => handleChangeNewTask({ e })}
        />
      </div>
      <div className='addNewTaskForm__container '>
        <label
          className='addNewTaskForm__label'
          htmlFor='addNewTaskForm-input-subtask'>
          Subtasks
        </label>

        <div className='addNewTaskForm__container--subtask'>
          {state.newTask.subtasks.map((subTask) => (
            <AddSubTask
              key={subTask.id}
              id={subTask.id}
            />
          ))}
        </div>
        <button
          onClick={handleCreateSubTask}
          className='addNewTaskForm__btn'>
          + Add New Subtask
        </button>
      </div>
      <div className='addNewTaskForm__container'>
        <label
          className='addNewTaskForm__label'
          htmlFor='addNewTaskForm-select-column'>
          Status
        </label>
        <div className='addNewTaskForm__select-container'>
          <div className='addNewTaskForm__select-arrow'>
            <IconChevron />
          </div>
          <select
            id='addNewTaskForm-select-column'
            className='addNewTaskForm__select'
            name='status'
            value={state.newTask.status}
            onChange={(e) => handleChangeNewTask({ e })}>
            <option
              value={''}
              className='addNewTaskForm__select-option'></option>
            {state.currentBoard &&
              state.currentBoard[0].boardColumns.map((column) => (
                <option
                  key={column.id}
                  className='addNewTaskForm__select-option'
                  value={column.name}>
                  {column.name}
                </option>
              ))}
          </select>
        </div>
      </div>
      <button
        type='submit'
        className='addNewTaskForm__btn addNewTaskForm__btn--createTask'>
        Create Task
      </button>
    </form>
  )
}
