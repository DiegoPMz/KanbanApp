import './navBar.css'

import { IconAddTaskMobile } from '../../assets/IconAddTaskMobile'
import { IconVerticalEllipsis } from '../../assets/IconVerticalEllipsis'
import { useScreenSize } from '../../hooks/useScreenSize'
import { NavbarLogoDekstop } from '../navbarLogoDekstop/NavbarLogoDekstop'
import { NavbarLogoMobile } from '../navbarLogoMobile/NavbarLogoMobile'

export const NavBar = () => {
  const { currenResolution, phone } = useScreenSize()

  return (
    <header className='navBar'>
      <div className='navBar__boardList-container'>
        {currenResolution === phone ? (
          <>
            <NavbarLogoMobile />
          </>
        ) : (
          <NavbarLogoDekstop />
        )}
      </div>

      <div className='navBar__settings-container'>
        <button className='settings-container__add'>
          <IconAddTaskMobile className={'settings-container__add-icon'} />
        </button>
        <button className='settings-container__options'>
          <IconVerticalEllipsis />
        </button>
      </div>
    </header>
  )
}
