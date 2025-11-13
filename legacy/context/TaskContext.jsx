import { createContext, useReducer } from 'react'
import { menuReducer, menuState } from '../reducer/menuReducer'

const TaskContext = createContext()

export const TaskContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(menuReducer, menuState)

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
  const handleDeleteSubTask = (id) => {
    dispatch({ type: 'deleteSubtask', payload: { id } })
  }

  const closeModalCompleteTask = (e) => {
    if (!e.target.matches('.infoTaskModal__container')) return

    dispatch({ type: 'completeTaskModalClose' })
  }
  const showModalOptionsEditTask = () => {
    dispatch({ type: 'editCurrentTaskModalActive' })
  }

  const onChangeCompleteTask = ({ target, id }) => {
    dispatch({ type: 'onChangeCompleteTask', payload: { target, id } })
  }

  const showModalDeleteTask = () => {
    dispatch({ type: 'deleteCurrentTaskModalActive' })
  }
  const showModalEditTask = () => {
    dispatch({ type: 'editTaskModalShow' })
  }

  const showModalDeleteTaskClose = (e) => {
    if (!e.target.matches('.deleteElementsBoard__container')) return

    dispatch({ type: 'deleteCurrentTaskModalClose' })
  }
  const deleteTask = () => {
    dispatch({ type: 'deleteCurrentTask' })
  }

  const closeModalEditTask = (e) => {
    if (!e.target.matches('.editTaskModal__container')) return
    dispatch({ type: 'editTaskModalClose' })
  }

  const onChangeEditTask = ({ target, id }) => {
    dispatch({ type: 'editTaskCaptureValues', payload: { target, id } })
  }

  const createNewSubtaskEditTask = () => {
    dispatch({ type: 'editTaskCreateNewSubtask' })
  }
  const deleteSubtaskEditTask = (id) => {
    dispatch({ type: 'editTaskDeleteSubtask', payload: { id } })
  }

  const submitTaskEdit = (e) => {
    e.preventDefault()
    dispatch({ type: 'editTaskSubmitNewValues' })
  }

  console.log('state en el context', state.completeTaskModalActive)

  const data = {
    state,
    closeModalNewTask,
    handleChangeNewTask,
    handleCreateSubTask,
    handleDeleteSubTask,
    closeModalCompleteTask,
    showModalOptionsEditTask,
    onChangeCompleteTask,
    showModalDeleteTask,
    showModalEditTask,
    showModalDeleteTaskClose,
    deleteTask,
    closeModalEditTask,
    onChangeEditTask,
    createNewSubtaskEditTask,
    deleteSubtaskEditTask,
    submitTaskEdit,
  }

  return <TaskContext.Provider value={data}> {children} </TaskContext.Provider>
}

export default TaskContext
