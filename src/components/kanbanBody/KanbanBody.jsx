import './kanbanBody.css'

import { TaskListContainer } from '../taskListContainer/TaskListContainer'

export const KanbanBody = () => {
  // const { state } = useContext(MenuContext)

  return (
    <section className='kanbanBody'>
      {/* {state.allBoards.length < 1 && <EmptyBoards />} */}
      {/* {state.currentBoard && } */}

      <TaskListContainer />
    </section>
  )
}
