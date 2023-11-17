import './emptyTask.css'

export const EmptyTask = () => {
  return (
    <div className='kanbanBody__emptyTask'>
      <span className='kanbanBody__emptyTask-message'>
        This board is empty. Create a new column to get started.
      </span>
      <button className='kanbanBody__emptyTask-btnContent'>
        + Add New Column
      </button>
    </div>
  )
}
