import { createContext, useReducer } from 'react'
import { useScreenSize } from '../hooks/useScreenSize'
import { menuReducer, menuState } from '../reducer/menuReducer'

const MenuContext = createContext()

export const MenuContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(menuReducer, menuState)
  const { currenResolution, phone } = useScreenSize()

  const handleShowMenu = () => {
    dispatch({ type: 'showMenu' })
  }
  const handleChangeTheme = () => {
    dispatch({ type: 'changeTheme' })
  }

  const handleCreateBoard = () => {
    currenResolution === phone
      ? dispatch({ type: 'clickCreateBoard-phone' })
      : dispatch({ type: 'clickCreateBoard-dekstop' })
  }

  const outsideClickToClose = (e) => {
    if (!e.target.matches('.addBoardForm__container')) return

    handleCreateBoard()
    dispatch({ type: 'resetValuesNewBoard' })
  }

  const handleChangeNewBoard = ({ e, id }) => {
    const target = e.target

    dispatch({ type: 'captureValuesNewBoard', payload: { target, id } })
  }

  const handleCreateColumn = () => {
    dispatch({ type: 'createNewColumn' })
  }
  const handleDeleteColumn = (e, id) => {
    dispatch({ type: 'deleteColumn', payload: { id } })
  }
  const handleAddBoard = () => {
    dispatch({ type: 'addNewBoard' })
  }

  const data = {
    state,
    handleShowMenu,
    handleChangeTheme,
    handleCreateBoard,
    handleChangeNewBoard,
    handleCreateColumn,
    handleDeleteColumn,
    handleAddBoard,
    outsideClickToClose,
  }

  return <MenuContext.Provider value={data}>{children} </MenuContext.Provider>
}

export default MenuContext

// useEffect(() => {
//   const mainElement = document.querySelector('.kanbanApp-main')
//   const CLASS_OPACITY_BG = 'main--opacity'

//   const handleClickOutside = (e) => {
//     if (!e.target.closest('.addBoardForm')) {
//       handleCreateBoard()
//     }
//   }

//   if (state.createBoardActive) {
//     document.addEventListener('click', handleClickOutside)
//   }

//   state.createBoardActive
//     ? mainElement.classList.add(CLASS_OPACITY_BG)
//     : mainElement.classList.remove(CLASS_OPACITY_BG)

//   return () => document.removeEventListener('click', handleClickOutside)
// }, [state.createBoardActive])
