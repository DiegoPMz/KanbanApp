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

  const deleteCurrentBoard = () => {
    dispatch({ type: 'deleteCurrentBoard' })
  }

  const showModalEditBoard = () => {
    dispatch({ type: 'editBoardModalShow' })
  }
  const closeModalEditBoard = (e) => {
    if (!e.target.matches('.editBoardModal__container')) return
    dispatch({ type: 'editBoardModalClose' })
  }

  const handleChangeEditBoard = ({ e, id }) => {
    dispatch({
      type: 'captureValuesEditBoard',
      payload: { target: e.target, id },
    })
  }
  const handleEditBoardNewColumn = () => {
    dispatch({ type: 'editBoardCreateNewColumn' })
  }
  const handleEditBoardDeleteColumn = (id) => {
    dispatch({ type: 'editBoardDeleteColumn', payload: { id } })
  }
  const handleEditBoardSubmitData = () => {
    dispatch({ type: 'editBoardSubmitData' })
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

  const showModalDeleteCurrentBoard = () => {
    dispatch({ type: 'deleteBoardModalShow' })
  }
  const closeModalDeleteCurrentBoard = () => {
    dispatch({ type: 'deleteBoardModalClose' })
  }

  const handleDeleteSubTask = (id) => {
    dispatch({ type: 'deleteSubtask', payload: { id } })
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
    selectCurrentBoard,
    deleteCurrentBoard,
    showModalDeleteCurrentBoard,
    closeModalDeleteCurrentBoard,
    showModalEditBoard,
    closeModalEditBoard,
    handleChangeEditBoard,
    handleEditBoardNewColumn,
    handleEditBoardDeleteColumn,
    handleEditBoardSubmitData,
    outsideClickToClose,
    handleSettingsModal,
    showModalNewTask,
    closeModalNewTask,
    handleChangeNewTask,
    handleCreateSubTask,
    handleDeleteSubTask,
    handleSubmitTask,
  }

  return <MenuContext.Provider value={data}>{children} </MenuContext.Provider>
}

export default MenuContext
