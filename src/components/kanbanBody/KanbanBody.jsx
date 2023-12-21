import './kanbanBody.css'

import { useContext } from 'react'
import MenuContext from '../../context/MenuContext'
import { EmptyBoards } from '../emptyBoards/EmptyBoards'
import { TaskListContainer } from '../taskListContainer/TaskListContainer'

export const KanbanBody = () => {
  const { state } = useContext(MenuContext)

  return (
    <section className='kanbanBody'>
      {state.allBoards.length === 0 && <EmptyBoards />}
      {state.currentBoard && <TaskListContainer />}
    </section>
  )
}
