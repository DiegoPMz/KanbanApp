import { useContext } from 'react'
import MenuContext from '../../context/MenuContext'
import { useScreenSize } from '../../hooks/useScreenSize'
import { BtnShowMenu } from '../btnShowMenu/BtnShowMenu'
import { KanbanBody } from '../kanbanBody/KanbanBody'
import { KanbanMenu } from '../kanbanMenu/KanbanMenu'
import { NavBar } from '../navBar/NavBar'

export const KanbanAppMain = () => {
  const { state } = useContext(MenuContext)
  const { currenResolution, phone } = useScreenSize()

  return (
    <>
      {state.menuActive && <KanbanMenu />}
      <main className='kanbanApp-main'>
        <NavBar />
        <KanbanBody />
      </main>

      {currenResolution !== phone && !state.menuActive && <BtnShowMenu />}
    </>
  )
}
