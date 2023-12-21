import './boardTheme.css'

import { useContext } from 'react'
import { IconDarkTheme } from '../../assets/IconDarkTheme'
import { IconLigthTheme } from '../../assets/IconLigthTheme'
import MenuContext from '../../context/MenuContext'

export const BoardTheme = () => {
  const { state, handleChangeTheme } = useContext(MenuContext)

  const classThemePosition =
    state.menuTheme === 'dark'
      ? 'BoardTheme_switchBtn-circle--dark'
      : 'BoardTheme_switchBtn-circle--ligth'

  return (
    <div className='boardTheme-container'>
      <IconLigthTheme />
      <button
        onClick={handleChangeTheme}
        className='BoardTheme_switchBtn'>
        <span
          className={`BoardTheme_switchBtn-circle ${classThemePosition} `}></span>
      </button>
      <IconDarkTheme />
    </div>
  )
}
