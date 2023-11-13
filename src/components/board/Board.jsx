import { IconBoard } from '../../assets/IconBoard'

export const Board = () => {
  return (
    <li className='board-list__item'>
      <IconBoard />
      <span className='board-list__item-name'>Platform Launch</span>
    </li>
  )
}
