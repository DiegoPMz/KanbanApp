import { useContext } from 'react'
import { IconBoard } from '../../assets/IconBoard'
import MenuContext from '../../context/menuContext'

export const Board = ({ data }) => {
  const { state, selectCurrentBoard } = useContext(MenuContext)

  let currentBoard
  state.currentBoard
    ? (currentBoard = data.boardId === state.currentBoard.boardId)
    : null

  return (
    <li className='board-list__item'>
      <a
        onClick={() => selectCurrentBoard(data)}
        href='#'
        className={
          currentBoard
            ? 'board-list__item-link board-list__item-link--currentBoard '
            : 'board-list__item-link'
        }>
        <IconBoard />
        <span className='board-list__item-name'>{data.boardName} </span>
      </a>
    </li>
  )
}
