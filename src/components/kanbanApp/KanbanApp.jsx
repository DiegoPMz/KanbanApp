import './kanbanApp.css'

import { useContext } from 'react'
import MenuContext from '../../context/menuContext'
import { useScreenSize } from '../../hooks/useScreenSize'
import { BtnShowMenu } from '../btnShowMenu/BtnShowMenu'
import { KanbanMenu } from '../kanbanMenu/KanbanMenu'
import { NavBar } from '../navBar/NavBar'

export const KanbanApp = () => {
  const { state } = useContext(MenuContext)
  const { currenResolution, phone } = useScreenSize()

  return (
    <main className='kanbanApp-main'>
      {state.menuActive && <KanbanMenu />}
      <div className='kanbanApp-main__subContainer'>
        <NavBar />
      </div>
      {currenResolution !== phone && !state.menuActive && <BtnShowMenu />}
    </main>
  )
}
