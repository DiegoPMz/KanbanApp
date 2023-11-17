import './emptyBoards.css'

export const EmptyBoards = () => {
  return (
    <div className='kanbanBody__emptyBoards'>
      <span className='kanbanBody__emptyBoards-message'>
        Looks Empty. Create a new board to get started.
      </span>
      <button className='kanbanBody__emptyBoards-btnNewBoard'>
        + Add New Board
      </button>
    </div>
  )
}
