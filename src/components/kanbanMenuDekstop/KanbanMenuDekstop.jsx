import { BoardList } from '../boardList/BoardList'
import { BoardTheme } from '../boardTheme/BoardTheme'
import { BtnHideMenu } from '../btnHideMenu/BtnHideMenu'

export const KanbanMenuDekstop = () => {
  return (
    <div className='kanbanMenu'>
      <BoardList />
      <div className='kanbanMenu__subContainer'>
        <BoardTheme />
        <BtnHideMenu />
      </div>
    </div>
  )
}
