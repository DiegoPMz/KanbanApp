import './kanbanApp.css'

import { useContext } from 'react'
import MenuContext from '../../context/menuContext'
import { useScreenSize } from '../../hooks/useScreenSize'
import { AddBoardForm } from '../addBoardForm/AddBoardForm'
import { BtnShowMenu } from '../btnShowMenu/BtnShowMenu'
import { KanbanBody } from '../kanbanBody/KanbanBody'
import { KanbanMenu } from '../kanbanMenu/KanbanMenu'
import { NavBar } from '../navBar/NavBar'

export const KanbanApp = () => {
  const { state } = useContext(MenuContext)
  const { currenResolution, phone } = useScreenSize()

  return (
    <div className='kanbanApp'>
      {state.menuActive && <KanbanMenu />}
      {state.createBoardActive && <AddBoardForm />}
      <main className='kanbanApp-main'>
        <NavBar />
        <KanbanBody />
      </main>

      {currenResolution !== phone && !state.menuActive && <BtnShowMenu />}
    </div>
  )
}
