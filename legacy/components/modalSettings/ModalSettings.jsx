import { useContext } from 'react'
import MenuContext from '../../context/MenuContext'
import './modalSettings.css'

export const ModalSettings = () => {
  const { showModalDeleteCurrentBoard, showModalEditBoard } =
    useContext(MenuContext)

  return (
    <div className='modalSettings'>
      <button
        onClick={showModalEditBoard}
        className='modalSettings__btn-edit'>
        Edit Board
      </button>
      <button
        onClick={showModalDeleteCurrentBoard}
        className='modalSettings__btn-delete'>
        Delete Board
      </button>
    </div>
  )
}
