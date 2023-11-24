import './emptyTask.css'

export const EmptyTask = () => {
  return (
    <div className='kanbanBody__emptyTask'>
      <span className='kanbanBody__emptyTask-message'>
        This Column is empty. Create a new task to get started.
      </span>
      <button className='kanbanBody__emptyTask-btnContent'>
        + Add New Task
      </button>
    </div>
  )
}
