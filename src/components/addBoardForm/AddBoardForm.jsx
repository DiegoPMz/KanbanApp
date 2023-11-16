import './addBoardForm.css'

import { useContext } from 'react'
import MenuContext from '../../context/menuContext'
import { AddBoardCreateColumns } from '../addBoardCreateColumns/AddBoardCreateColumns'

export const AddBoardForm = () => {
  const { state, outsideClickToClose, handleChangeNewBoard } =
    useContext(MenuContext)

  return (
    <div
      onClick={(e) => outsideClickToClose(e)}
      className='addBoardForm__container'>
      <div className='addBoardForm'>
        <span className='addBoardForm__title'>Add New Board</span>
        <form
          onSubmit={(e) => e.preventDefault()}
          id='addBoardForm'
          className='addBoardForm__boardform'>
          <div className='addBoardForm__boardform-containerName'>
            <label
              htmlFor='addBoardForm-input-name'
              className='boardform-containerName__label'>
              Board Name
            </label>
            <input
              id='addBoardForm-input-name'
              form='addBoardForm'
              type='text'
              className='boardform-containerName__name'
              placeholder='e.g. Web Design'
              name='boardName'
              value={state.newBoard.boardName}
              onChange={(e) => handleChangeNewBoard({ e })}
            />
          </div>
          <AddBoardCreateColumns />
        </form>
      </div>
    </div>
  )
}
