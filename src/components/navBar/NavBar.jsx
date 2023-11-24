import './navBar.css'

import { IconAddTaskMobile } from '../../assets/IconAddTaskMobile'
import { IconVerticalEllipsis } from '../../assets/IconVerticalEllipsis'

import { useContext } from 'react'
import MenuContext from '../../context/MenuContext'
import { useScreenSize } from '../../hooks/useScreenSize'
import { ModalSettings } from '../modalSettings/ModalSettings'
import { NavbarLogoDekstop } from '../navbarLogoDekstop/NavbarLogoDekstop'
import { NavbarLogoMobile } from '../navbarLogoMobile/NavbarLogoMobile'

export const NavBar = () => {
  const { state, showModalNewTask, handleSettingsModal } =
    useContext(MenuContext)
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
        <button
          onClick={showModalNewTask}
          className={
            state.currentBoard
              ? 'settings-container__add settings-container__add--currentBoard'
              : 'settings-container__add'
          }>
          <IconAddTaskMobile className={'settings-container__add-icon'} />
        </button>
        <button
          onClick={handleSettingsModal}
          className={
            state.currentBoard
              ? 'settings-container__options settings-container__options--currentBoard'
              : 'settings-container__options'
          }>
          <IconVerticalEllipsis />
        </button>
      </div>

      {state.settingsModalActive && <ModalSettings />}
    </header>
  )
}
