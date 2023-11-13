import './boardList.css'

import { useContext } from 'react'
import { IconBoard } from '../../assets/IconBoard'
import { LogoDark } from '../../assets/LogoDark'
import { LogoLigth } from '../../assets/LogoLigth'
import MenuContext from '../../context/menuContext'
import { useScreenSize } from '../../hooks/useScreenSize'

export const BoardList = () => {
  const { state } = useContext(MenuContext)
  const { currenResolution, phone } = useScreenSize()

  return (
    <>
      <div className='kanbanMenu__boardcontainer'>
        {currenResolution !== phone && (
          <div className='kanbanMenu__logoDekstopContainer'>
            {state.menuTheme === 'dark' ? <LogoDark /> : <LogoLigth />}
          </div>
        )}
        <span className='kanbanMenu__allboards'>ALL BOARDS (3)</span>
        <ul className='kanbanMenu__board-list'>
          <li className='board-list__item'>
            <a
              href='#'
              className='board-list__item-link'>
              <IconBoard />
              <span className='board-list__item-name'>Platform Launch</span>
            </a>
          </li>
          <li className='board-list__item'>
            <a
              href='#'
              className='board-list__item-link'>
              <IconBoard />
              <span className='board-list__item-name'>Platform Launch</span>
            </a>
          </li>
          <li className='board-list__item'>
            <a
              href='#'
              className='board-list__item-link'>
              <IconBoard />
              <span className='board-list__item-name'>Platform Launch</span>
            </a>
          </li>
          <li className='board-list__item'>
            <a
              href='#'
              className='board-list__item-link'>
              <IconBoard />
              <span className='board-list__item-name'>Platform Launch</span>
            </a>
          </li>
          <li className='board-list__item'>
            <a
              href='#'
              className='board-list__item-link'>
              <IconBoard />
              <span className='board-list__item-name'>Platform Launch</span>
            </a>
          </li>
          <li className='board-list__item'>
            <a
              href='#'
              className='board-list__item-link'>
              <IconBoard />
              <span className='board-list__item-name'>Platform Launch</span>
            </a>
          </li>
        </ul>
      </div>
    </>
  )
}
