import './btnShowMenu.css'

import { useContext } from 'react'
import { IconShowSideBar } from '../../assets/IconShowSideBar'
import MenuContext from '../../context/menuContext'

export const BtnShowMenu = () => {
  const { handleShowMenu } = useContext(MenuContext)

  return (
    <button
      onClick={handleShowMenu}
      className='kanbanApp-main__btnShowMenu'>
      <IconShowSideBar />
    </button>
  )
}
