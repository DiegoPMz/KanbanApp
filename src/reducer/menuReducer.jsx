import { currentTheme } from '../helpers/currentTheme'

export const menuState = {
  menuActive: false,
  menuTheme: currentTheme(),
}

export const menuReducer = (state, action) => {
  switch (action.type) {
    case 'showMenu': {
      return { ...state, menuActive: !state.menuActive }
    }
    case 'changeTheme': {
      const bodyElement = document.querySelector('body')

      const changeThemeColor = {
        dark: () => {
          bodyElement.setAttribute('id', 'dark-theme')
        },

        ligth: () => {
          bodyElement.setAttribute('id', 'ligth-theme')
        },
      }

      const changeState = state.menuTheme === 'dark' ? 'ligth' : 'dark'

      const setIdTheme = changeThemeColor[changeState]
      setIdTheme && setIdTheme()

      return {
        ...state,
        menuTheme: setIdTheme ? changeState : state.menuTheme,
      }
    }

    default:
      break
  }
}
