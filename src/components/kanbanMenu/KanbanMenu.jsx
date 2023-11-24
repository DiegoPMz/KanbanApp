import './kanbanMenu.css'

import { useScreenSize } from '../../hooks/useScreenSize'
import { BoardList } from '../boardList/BoardList'
import { BoardTheme } from '../boardTheme/BoardTheme'
import { KanbanMenuDekstop } from '../kanbanMenuDekstop/KanbanMenuDekstop'

export const KanbanMenu = () => {
  const { currenResolution, phone } = useScreenSize()

  return (
    <div className={`kanbanMenu-perimeter`}>
      {currenResolution === phone ? (
        <div className='kanbanMenu'>
          <BoardList />
          <BoardTheme />
        </div>
      ) : (
        <KanbanMenuDekstop />
      )}
    </div>
  )
}
