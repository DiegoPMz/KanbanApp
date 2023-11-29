import './editBoardColumn.css'

import { useContext } from 'react'
import { IconCross } from '../../assets/IconCross'
import MenuContext from '../../context/MenuContext'

export const EditBoardColumn = ({ id, column }) => {
  const { handleChangeEditBoard, handleEditBoardDeleteColumn } =
    useContext(MenuContext)

  return (
    <li className='editBoard-containerColumns__containerName'>
      <input
        id='editBoard-input-ColumnName'
        form='editBoardModal-form'
        type='text'
        placeholder='Column Name'
        className='containerColumns__containerName-nameColumn'
        name='columnName'
        value={column.name}
        onChange={(e) => handleChangeEditBoard({ e, id })}
      />

      <button onClick={() => handleEditBoardDeleteColumn(id)}>
        <IconCross />
      </button>
    </li>
  )
}
