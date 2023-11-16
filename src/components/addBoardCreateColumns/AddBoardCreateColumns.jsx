import './addBoardCreateColumns.css'

import { useContext } from 'react'
import MenuContext from '../../context/menuContext'
import { AddBoardColumn } from '../addBoardColumn/AddBoardColumn'

export const AddBoardCreateColumns = () => {
  const { state, handleCreateColumn, handleAddBoard } = useContext(MenuContext)

  return (
    <div className='addBoardForm__boardform-containerColumns'>
      <label
        form='addBoardForm'
        htmlFor='addBoardForm-input-ColumnName'
        className='boardform-containerColumns__label'>
        Board Columns
      </label>

      <ul className='boardform-containerColumns__containerNameList'>
        {state.newBoard.boardColumns.map((column) => (
          <AddBoardColumn
            key={column.id}
            id={column.id}
          />
        ))}
      </ul>

      <button
        onClick={handleCreateColumn}
        className='boardform-containerColumns__btn boardform-containerColumns__btn-otherColor'>
        + Add New Column
      </button>
      <button
        onClick={handleAddBoard}
        className='boardform-containerColumns__btn  '>
        Create New Board
      </button>
    </div>
  )
}
