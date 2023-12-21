import './emptyBoards.css'

import { useContext } from 'react'
import MenuContext from '../../context/MenuContext'

export const EmptyBoards = () => {
  const { handleCreateBoard } = useContext(MenuContext)

  return (
    <div className='kanbanBody__emptyBoards'>
      <span className='kanbanBody__emptyBoards-message'>
        Looks Empty. Create a new board to get started.
      </span>
      <button
        onClick={handleCreateBoard}
        className='kanbanBody__emptyBoards-btnNewBoard'>
        + Add New Board
      </button>
    </div>
  )
}
