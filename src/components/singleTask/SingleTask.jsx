import './singleTask.css'

export const SingleTask = ({ task }) => {
  return (
    <li className='singleTask__item'>
      <a className='singleTask__item-link'>
        <h3 className='singleTask__item-title'> {task.title} </h3>
        <span className='singleTask__item-substasks'>
          {`0 of ${task.subtasks.length} subtasks`}
        </span>
      </a>
    </li>
  )
}
