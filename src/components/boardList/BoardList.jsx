import './boardList.css'

import { useContext } from 'react'
import { LogoDark } from '../../assets/LogoDark'
import { LogoLigth } from '../../assets/LogoLigth'
import MenuContext from '../../context/menuContext'
import { useScreenSize } from '../../hooks/useScreenSize'
import { AddBoardBtn } from '../addBoardBtn/AddBoardBtn'
import { Board } from '../board/Board'

export const BoardList = () => {
  const { state } = useContext(MenuContext)
  const { currenResolution, phone } = useScreenSize()

  return (
    <div className='kanbanMenu__boardcontainer'>
      {currenResolution !== phone && (
        <div className='kanbanMenu__logoDekstopContainer'>
          {state.menuTheme === 'dark' ? <LogoDark /> : <LogoLigth />}
        </div>
      )}
      <span className='kanbanMenu__allboards'>
        ALL BOARDS ({state.allBoards.length})
      </span>
      <ul className='kanbanMenu__board-list'>
        {state.allBoards.length > 0 &&
          state.allBoards.map((board) => (
            <Board
              key={board.boardId}
              data={board}
              id={board.boardId}
            />
          ))}

        <AddBoardBtn />
      </ul>
    </div>
  )
}
