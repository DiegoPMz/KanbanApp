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

  const selectCurrentBoard = (board) => {
    currenResolution === phone
      ? dispatch({ type: 'currentBoard-phone', payload: { ...board } })
      : dispatch({ type: 'currentBoard-dekstop', payload: { ...board } })
  }

  const handleSettingsModal = () => {
    dispatch({ type: 'settingsModalActive' })
  }

  const showModalNewTask = () => {
    dispatch({ type: 'createNewTaskShow' })
  }
  const closeModalNewTask = (e) => {
    if (!e.target.matches('.addNewTask-container')) return

    dispatch({ type: 'createNewTaskClose' })
  }

  const handleChangeNewTask = ({ e, id }) => {
    dispatch({ type: 'captureValuesNewTask', payload: { e, id } })
  }
  const handleCreateSubTask = () => {
    dispatch({ type: 'createSubTask' })
  }
  const handleSubmitTask = (e) => {
    e.preventDefault()
    dispatch({ type: 'submitCreateNewTask' })
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
    selectCurrentBoard,
    handleSettingsModal,
    showModalNewTask,
    closeModalNewTask,
    handleChangeNewTask,
    handleCreateSubTask,
    handleSubmitTask,
  }

  return <MenuContext.Provider value={data}>{children} </MenuContext.Provider>
}

export default MenuContext
