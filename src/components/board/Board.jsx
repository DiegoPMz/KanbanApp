import { useContext } from 'react'
import { IconBoard } from '../../assets/IconBoard'
import MenuContext from '../../context/menuContext'

export const Board = ({ data, id }) => {
  const { state, selectCurrentBoard } = useContext(MenuContext)
  let classCurrentBoard = false

  if (state.currentBoard)
    classCurrentBoard = state.currentBoard[0].boardId === id

  return (
    <li className='board-list__item'>
      <a
        onClick={() => selectCurrentBoard(data)}
        className={
          classCurrentBoard
            ? 'board-list__item-link board-list__item-link--currentBoard '
            : 'board-list__item-link'
        }>
        <IconBoard />
        <span className='board-list__item-name'>{data.boardName} </span>
      </a>
    </li>
  )
}
