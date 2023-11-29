import './deleteBoard.css'

import { useContext } from 'react'
import MenuContext from '../../context/MenuContext'
import { DeleteElementsBoard } from '../deleteElementsBoard/DeleteElementsBoard'

export const DeleteBoard = () => {
  const { state, deleteCurrentBoard, closeModalDeleteCurrentBoard } =
    useContext(MenuContext)

  return (
    <DeleteElementsBoard
      handleDelete={deleteCurrentBoard}
      handleCloseModal={closeModalDeleteCurrentBoard}
      handleCancel={closeModalDeleteCurrentBoard}>
      <h4>Delete this board?</h4>
      <p>
        Are you sure you want to delete the
        <span className='deleteBoard__boardName'>
          ‘{state.currentBoard[0].boardName}’
        </span>
        ? This action will remove all columns and tasks and cannot be reversed.
      </p>
    </DeleteElementsBoard>
  )
}
