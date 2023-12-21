import './kanbanBody.css'

import { useContext } from 'react'
import MenuContext from '../../context/MenuContext'
import { EmptyBoards } from '../emptyBoards/EmptyBoards'
import { EmptyTask } from '../emptyTask/EmptyTask'
import { TaskListContainer } from '../taskListContainer/TaskListContainer'

export const KanbanBody = () => {
  const { state } = useContext(MenuContext)

  const validationEmptyTasks =
    state.currentBoard &&
    state.currentBoard[0]?.boardColumns.map((col) => col.task).flat()

  return (
    <section className='kanbanBody'>
      {state.allBoards.length === 0 && <EmptyBoards />}
      {state.currentBoard && validationEmptyTasks.length === 0 && <EmptyTask />}
      {state.currentBoard && <TaskListContainer />}
    </section>
  )
}
