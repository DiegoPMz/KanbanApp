import './taskList.css'

import { SingleTask } from '../singleTask/SingleTask'

export const TaskList = () => {
  return (
    <div className='taskList'>
      <h2 className='taskList__title'>
        <div className='taskList__title-circle'></div>
        <span className='taskList__title-name'>TODO (4)</span>
      </h2>

      <ul className='taskList__list'>
        <SingleTask />
        <SingleTask />
        <SingleTask />
        <SingleTask />
      </ul>
    </div>
  )
}
