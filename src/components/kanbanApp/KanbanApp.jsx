import './kanbanApp.css'

import { useContext } from 'react'

import MenuContext from '../../context/MenuContext'
import { useScreenSize } from '../../hooks/useScreenSize'
import { BtnShowMenu } from '../btnShowMenu/BtnShowMenu'
import { KanbanAppModals } from '../kanbanAppModals/KanbanAppModals'
import { KanbanBody } from '../kanbanBody/KanbanBody'
import { KanbanMenu } from '../kanbanMenu/KanbanMenu'
import { NavBar } from '../navBar/NavBar'

export const KanbanApp = () => {
  const { state } = useContext(MenuContext)
  const { currenResolution, phone } = useScreenSize()

  return (
    <div className='kanbanApp'>
      {state.menuActive && <KanbanMenu />}
      <main className='kanbanApp-main'>
        <NavBar />
        <KanbanBody />
      </main>
      {currenResolution !== phone && <BtnShowMenu />}

      <KanbanAppModals />
    </div>
  )
}
