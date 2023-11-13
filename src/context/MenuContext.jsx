import { createContext, useReducer } from 'react'
import { menuReducer, menuState } from '../reducer/menuReducer'

const MenuContext = createContext()

export const MenuContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(menuReducer, menuState)

  const handleShowMenu = () => {
    dispatch({ type: 'showMenu' })
  }
  const handleChangeTheme = () => {
    dispatch({ type: 'changeTheme' })
  }

  const data = {
    state,
    handleShowMenu,
    handleChangeTheme,
  }

  return <MenuContext.Provider value={data}>{children} </MenuContext.Provider>
}

export default MenuContext

// const handleShowMenu = useCallback(() => {
//   dispatch({ type: 'showMenu' })
// }, [dispatch])

// const handleChangeTheme = useCallback(() => {
//   dispatch({ type: 'changeTheme' })
// }, [dispatch])
