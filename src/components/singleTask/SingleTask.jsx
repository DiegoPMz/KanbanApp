import './singleTask.css'

import { useContext } from 'react'
import { IconCheck } from '../../assets/IconCheck'
import MenuContext from '../../context/MenuContext'

export const SingleTask = ({ task }) => {
  const { showModalCompleteTask } = useContext(MenuContext)

  const subtaskComplete = task.subtasks.filter(
    (el) => el.status === 'complete',
  ).length

  return (
    <li className='singleTask__item'>
      <a
        onClick={() => showModalCompleteTask({ id: task.id })}
        className='singleTask__item-link'>
        <h3 className='singleTask__item-title'> {task.title} </h3>
        {task.subtasks.length > 0 && (
          <span className='singleTask__item-substasks'>
            {subtaskComplete < task.subtasks.length ? (
              `${subtaskComplete} of ${task.subtasks.length} subtasks`
            ) : (
              <div className='substasks__complete'>
                <IconCheck />
              </div>
            )}
          </span>
        )}
      </a>
    </li>
  )
}
