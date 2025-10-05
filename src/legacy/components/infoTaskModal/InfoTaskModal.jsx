import './infoTaskModal.css'

import { useContext } from 'react'
import { IconVerticalEllipsis } from '../../assets/IconVerticalEllipsis'
import MenuContext from '../../context/MenuContext'
import { InfoTaskModalSettings } from '../InfoTaskModalSettings/InfoTaskModalSettings'
import { InfoTaskForm } from '../infoTaskForm/InfoTaskForm'

export const InfoTaskModal = () => {
  const { state, closeModalCompleteTask, showModalOptionsEditTask } =
    useContext(MenuContext)

  return (
    <div
      onClick={(e) => closeModalCompleteTask(e)}
      className='infoTaskModal__container'>
      <div className='infoTaskModal'>
        <div className='infoTaskModal__container-title-btn'>
          <h4 className='infoTaskModal__container-title'>
            {state.currentTask.title}
          </h4>
          <button
            onClick={showModalOptionsEditTask}
            className='infoTaskModal__container-btn'>
            <IconVerticalEllipsis />
          </button>
        </div>
        {state.currentTask.description && (
          <p className='infoTaskModal__description'>
            {state.currentTask.description}
          </p>
        )}
        <InfoTaskForm />

        {state.optionsEditTaskModalActive && <InfoTaskModalSettings />}
      </div>
    </div>
  )
}
