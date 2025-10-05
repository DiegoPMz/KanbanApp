import { useContext } from 'react'
import { IconChevron } from '../../assets/IconChevron'
import { LogoMobile } from '../../assets/LogoMobile'
import MenuContext from '../../context/MenuContext'

export const NavbarLogoMobile = () => {
  const { state, handleShowMenu } = useContext(MenuContext)

  console.log()

  return (
    <>
      <LogoMobile />
      <button
        onClick={handleShowMenu}
        className='boardList-container__btn'>
        <span className='boardList-container__txt'>
          {state.currentBoard ? state.currentBoard[0].boardName : '🖍'}
        </span>
        <IconChevron />
      </button>
    </>
  )
}
