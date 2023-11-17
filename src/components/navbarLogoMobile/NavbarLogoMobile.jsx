import { useContext } from 'react'
import { IconChevron } from '../../assets/IconChevron'
import { LogoMobile } from '../../assets/LogoMobile'
import MenuContext from '../../context/menuContext'

export const NavbarLogoMobile = () => {
  const { state, handleShowMenu } = useContext(MenuContext)

  return (
    <>
      <LogoMobile />
      <button
        onClick={handleShowMenu}
        className='boardList-container__btn'>
        <span className='boardList-container__txt'>
          {state.currentBoard ? `${state.currentBoard.boardName}` : '🖍'}
        </span>
        <IconChevron />
      </button>
    </>
  )
}
