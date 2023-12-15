import { createContext, useReducer } from 'react'
import { menuReducer, menuState } from '../reducer/menuReducer'

const BoardContext = createContext()

export const BoardContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(menuReducer, menuState)
  // const { currenResolution, phone } = useScreenSize()

  const closeModalCreateNewBoard = (e) => {
    if (!e.target.matches('.addBoardForm__container')) return

    // currenResolution === phone
    //   ? dispatch({ type: 'clickCreateBoard-phone' })
    //   : dispatch({ type: 'clickCreateBoard-dekstop' })

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
  const deleteCurrentBoard = () => {
    dispatch({ type: 'deleteCurrentBoard' })
  }
  const closeModalDeleteCurrentBoard = () => {
    dispatch({ type: 'deleteBoardModalClose' })
  }

  const handleChangeEditBoard = ({ e, id }) => {
    dispatch({
      type: 'captureValuesEditBoard',
      payload: { target: e.target, id },
    })
  }
  const closeModalEditBoard = (e) => {
    if (!e.target.matches('.editBoardModal__container')) return
    dispatch({ type: 'editBoardModalClose' })
  }

  const handleEditBoardNewColumn = () => {
    dispatch({ type: 'editBoardCreateNewColumn' })
  }

  const handleEditBoardSubmitData = () => {
    dispatch({ type: 'editBoardSubmitData' })
  }

  const handleEditBoardDeleteColumn = (id) => {
    dispatch({ type: 'editBoardDeleteColumn', payload: { id } })
  }

  const data = {
    state,
    closeModalCreateNewBoard,
    handleChangeNewBoard,
    handleCreateColumn,
    handleDeleteColumn,
    handleAddBoard,
    deleteCurrentBoard,
    closeModalDeleteCurrentBoard,
    handleChangeEditBoard,
    closeModalEditBoard,
    handleEditBoardNewColumn,
    handleEditBoardSubmitData,
    handleEditBoardDeleteColumn,
  }

  return <BoardContext.Provider value={data}>{children}</BoardContext.Provider>
}

export default BoardContext
