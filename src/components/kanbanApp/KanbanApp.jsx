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

      <span>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque
        sapiente iste quo magni. Qui eveniet, itaque dolore animi iste hic
        ullam? Est fuga quaerat perspiciatis exercitationem odio maxime vitae
        molestiae?
      </span>

      <KanbanAppModals />
      {currenResolution !== phone && !state.menuActive && <BtnShowMenu />}
    </div>
  )
}
