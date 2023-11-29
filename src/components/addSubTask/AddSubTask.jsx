import { useContext } from 'react'
import { IconCross } from '../../assets/IconCross'
import MenuContext from '../../context/menuContext'

export const AddSubTask = ({ id }) => {
  const { state, handleChangeNewTask, handleDeleteSubTask } =
    useContext(MenuContext)

  const getValueElement = state.newTask.subtasks.find(
    (subtask) => subtask.id === id,
  )

  return (
    <div className='container-subtask__subcontainer'>
      <input
        id='addNewTaskForm-input-subtask'
        placeholder='e.g. Make coffee'
        className='addNewTaskForm__input'
        type='text'
        name='subTask-content'
        value={getValueElement.content}
        onChange={(e) => handleChangeNewTask({ e, id })}
      />
      <button onClick={() => handleDeleteSubTask(id)}>
        <IconCross />
      </button>
    </div>
  )
}
