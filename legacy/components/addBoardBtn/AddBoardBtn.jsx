import './addBoardBtn.css'

import { useContext } from 'react'
import { IconBoard } from '../../assets/IconBoard'
import MenuContext from '../../context/MenuContext'

export const AddBoardBtn = () => {
  const { handleCreateBoard } = useContext(MenuContext)

  return (
    <li className='board-list__item'>
      <button
        onClick={handleCreateBoard}
        className='board-list__item-link--add'>
        <IconBoard />
        <span className='board-list__item-name'>+ Create New Board</span>
      </button>
    </li>
  )
}
