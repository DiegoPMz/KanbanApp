import './boardTheme.css'

import { useContext } from 'react'
import { IconDarkTheme } from '../../assets/IconDarkTheme'
import { IconLigthTheme } from '../../assets/IconLigthTheme'
import MenuContext from '../../context/menuContext'

export const BoardTheme = () => {
  const { state, handleChangeTheme } = useContext(MenuContext)

  const classThemePosition =
    state.menuTheme === 'dark'
      ? 'BoardTheme_switchBtn--dark'
      : 'BoardTheme_switchBtn--ligth'

  return (
    <div className='boardTheme-container'>
      <IconLigthTheme />
      <button
        onClick={handleChangeTheme}
        className={`BoardTheme_switchBtn ${classThemePosition} `}>
        <span className='BoardTheme_switchBtn-circle'></span>
      </button>
      <IconDarkTheme />
    </div>
  )
}
