import './editBoardCreateColumns.css'

import { useContext } from 'react'
import MenuContext from '../../context/MenuContext'
import { EditBoardColumn } from '../editBoardColumn/EditBoardColumn'

export const EditBoardCreateColumns = () => {
  const { state, handleEditBoardNewColumn, handleEditBoardSubmitData } =
    useContext(MenuContext)

  return (
    <div className='editBoard__boardform-containerColumns'>
      <label
        form='editBoardModal-form'
        htmlFor='editBoard-input-ColumnName'
        className='editBoard-containerColumns__label'>
        Board Columns
      </label>

      <ul className='editBoard-containerColumns__containerNameList'>
        {state.currentBoard[0].boardColumns.map((column) => (
          <EditBoardColumn
            key={column.id}
            id={column.id}
            column={column}
          />
        ))}
      </ul>

      <button
        onClick={handleEditBoardNewColumn}
        className='editBoard-containerColumns__btn editBoard-containerColumns__btn-otherColor'>
        + Add New Column
      </button>
      <button
        onClick={handleEditBoardSubmitData}
        className='editBoard-containerColumns__btn'>
        Save Changes
      </button>
    </div>
  )
}
