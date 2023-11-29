import './editBoardModal.css'

import { useContext } from 'react'
import MenuContext from '../../context/MenuContext'
import { EditBoardCreateColumns } from '../editBoardCreateColumns/EditBoardCreateColumns'

export const EditBoardModal = () => {
  const { state, handleChangeEditBoard, closeModalEditBoard } =
    useContext(MenuContext)

  const boardName = state.currentBoard[0].boardName

  return (
    <div
      onClick={(e) => closeModalEditBoard(e)}
      className='editBoardModal__container'>
      <div className='editBoardModal'>
        <span className='editBoardModal__title'>Edit Board</span>
        <form
          onSubmit={(e) => e.preventDefault()}
          id='editBoardModal-form'
          className='editBoardModal__boardform'>
          <div className='editBoardModal__boardform-containerName'>
            <label
              htmlFor='editBoardModal-input-name'
              className='editBoardModal-containerName__label'>
              Board Name
            </label>
            <input
              id='editBoardModal-input-name'
              form='editBoardModal-form'
              type='text'
              className='editBoardModal-containerName__name'
              placeholder='e.g. Web Design'
              name='boardName'
              value={boardName}
              onChange={(e) => handleChangeEditBoard({ e })}
            />
          </div>
          <EditBoardCreateColumns />
        </form>
      </div>
    </div>
  )
}
