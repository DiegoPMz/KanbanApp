import { useContext } from 'react'
import { LogoDark } from '../../assets/LogoDark'
import { LogoLigth } from '../../assets/LogoLigth'
import MenuContext from '../../context/menuContext'

export const NavbarLogoDekstop = () => {
  const { state } = useContext(MenuContext)

  return (
    <>
      {state.menuActive ? (
        <span className='boardList-container__txt'>
          {state.currentBoard ? `${state.currentBoard[0].boardName}` : '🖍'}
        </span>
      ) : (
        <>
          <div className='boardList-container__logoDekstop'>
            {state.menuTheme === 'dark' ? <LogoDark /> : <LogoLigth />}
          </div>
          <span className='boardList-container__txt'>
            {state.currentBoard && state.currentBoard[0].boardName}
          </span>
        </>
      )}
    </>
  )
}
