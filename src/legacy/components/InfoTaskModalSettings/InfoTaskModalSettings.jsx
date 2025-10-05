import './infoTaskModalSettings.css'

import { useContext } from 'react'
import MenuContext from '../../context/MenuContext'

export const InfoTaskModalSettings = () => {
  const { showModalDeleteTask, showModalEditTask } = useContext(MenuContext)

  return (
    <div className='infoTaskModalSettings'>
      <button
        onClick={showModalEditTask}
        className='infoTaskModalSettings__btn infoTaskModalSettings__btn--edit '>
        Edit Task
      </button>
      <button
        onClick={showModalDeleteTask}
        className='infoTaskModalSettings__btn infoTaskModalSettings__btn--delete '>
        Delete Task
      </button>
    </div>
  )
}
