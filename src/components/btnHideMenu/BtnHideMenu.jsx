import './btnHideMenu.css'

import { useContext } from 'react'
import { IconHideSideBar } from '../../assets/IconHideSideBar'
import MenuContext from '../../context/menuContext'

export const BtnHideMenu = () => {
  const { handleShowMenu } = useContext(MenuContext)

  return (
    <button
      onClick={handleShowMenu}
      className='kanbanMenu__btnHideMenu'>
      <IconHideSideBar />
      <span className='kanbanMenu__btnHideMenu-txt'>Hide Sidebar</span>
    </button>
  )
}
