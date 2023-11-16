import { IconBoard } from '../../assets/IconBoard'

export const Board = ({ data }) => {
  return (
    <li className='board-list__item'>
      <a
        href='#'
        className='board-list__item-link'>
        <IconBoard />
        <span className='board-list__item-name'>{data.boardName} </span>
      </a>
    </li>
  )
}
