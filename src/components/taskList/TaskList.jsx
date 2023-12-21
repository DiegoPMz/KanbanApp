import './taskList.css'

import {
  DndContext,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useContext } from 'react'
import MenuContext from '../../context/MenuContext'
import { useGenerateColor } from '../../hooks/useGenerateColor'
import { SingleTask } from '../singleTask/SingleTask'

export const TaskList = ({ column, position }) => {
  const { circleColor } = useGenerateColor()
  const { handleDragEnd } = useContext(MenuContext)

  const sensors = useSensors(
    useSensor(MouseSensor, {
      // Require the mouse to move by 10 pixels before activating
      activationConstraint: {
        delay: 250,
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      // Press delay of 250ms, with tolerance of 5px of movement
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
  )

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

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={(event) => handleDragEnd(event, column)}>
            <ul className='taskList__list'>
              <SortableContext
                items={column.task}
                strategy={verticalListSortingStrategy}>
                {column.task.length >= 1 &&
                  column.task.map((task) => (
                    <SingleTask
                      key={task.id}
                      task={task}
                    />
                  ))}
              </SortableContext>
            </ul>
          </DndContext>
        </div>
      )}
    </>
  )
}
