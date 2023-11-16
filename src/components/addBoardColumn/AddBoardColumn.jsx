import './addBoardColumn.css'

import { useContext } from 'react'
import { IconCross } from '../../assets/IconCross'
import MenuContext from '../../context/menuContext'

export const AddBoardColumn = ({ id }) => {
  const { state, handleChangeNewBoard, handleDeleteColumn } =
    useContext(MenuContext)

  const columnEdit = state.newBoard.boardColumns.find(
    (el) => el.id === id && el,
  )

  return (
    <li className='boardform-containerColumns__containerName'>
      <input
        id='addBoardForm-input-ColumnName'
        form='addBoardForm'
        type='text'
        placeholder='Column Name'
        className='containerColumns__containerName-nameColumn'
        name='newColumnName'
        value={columnEdit.name}
        onChange={(e) => handleChangeNewBoard({ e, id })}
      />

      <button onClick={(e) => handleDeleteColumn(e, id)}>
        <IconCross />
      </button>
    </li>
  )
}
