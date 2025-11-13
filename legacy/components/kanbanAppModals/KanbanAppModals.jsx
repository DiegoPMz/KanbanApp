import { useContext } from 'react'
import MenuContext from '../../context/MenuContext'
import { AddBoardForm } from '../addBoardForm/AddBoardForm'
import { AddNewTask } from '../addNewTask/AddNewTask'
import { DeleteBoard } from '../deleteBoard/DeleteBoard'
import { DeleteTask } from '../deleteTask/DeleteTask'
import { EditBoardModal } from '../editBoardModal/EditBoardModal'
import { EditTaskModal } from '../editTaskModal/EditTaskModal'
import { InfoTaskModal } from '../infoTaskModal/InfoTaskModal'

export const KanbanAppModals = () => {
  const { state } = useContext(MenuContext)

  return (
    <>
      {state.createBoardActive && <AddBoardForm />}
      {state.createNewTask && <AddNewTask />}
      {state.deleteBoardModalActive && <DeleteBoard />}
      {state.editBoardModalActive && <EditBoardModal />}

      {state.completeTaskModalActive && <InfoTaskModal />}
      {state.deleteTaskModalActive && <DeleteTask />}
      {state.editTaskModalActive && <EditTaskModal />}
    </>
  )
}
