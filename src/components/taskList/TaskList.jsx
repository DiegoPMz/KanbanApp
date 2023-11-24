import './taskList.css'

import { useGenerateColor } from '../../hooks/useGenerateColor'
import { SingleTask } from '../singleTask/SingleTask'

export const TaskList = ({ column, position }) => {
  const { circleColor } = useGenerateColor()

  return (
    <>
      {column && (
        <div
          key={column.id}
          className='taskList'>
          <h2 className='taskList__title'>
            <div
              style={{ backgroundColor: circleColor }}
              className='taskList__title-circle'></div>
            <span className='taskList__title-name'>{` ${column.name} (${
              parseInt(position) + 1
            })`}</span>
          </h2>
          <ul className='taskList__list'>
            {column.task.length >= 1 &&
              column.task.map((task) => (
                <SingleTask
                  key={task.id}
                  task={task}
                />
              ))}
          </ul>
        </div>
      )}
    </>
  )
}
