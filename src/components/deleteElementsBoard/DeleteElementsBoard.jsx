import './deleteElementsBoard.css'

export const DeleteElementsBoard = ({
  children,
  handleCloseModal,
  handleDelete,
  handleCancel,
}) => {
  return (
    <div
      onClick={handleCloseModal && handleCloseModal}
      className='deleteElementsBoard__container'>
      <div className='deleteElementsBoard'>
        {children}
        <div className='deleteElementsBoard_btnContainer'>
          <button
            onClick={handleDelete && handleDelete}
            className='deleteElementsBoard__btn deleteElementsBoard__btn--delete'>
            Delete
          </button>
          <button
            onClick={handleCancel && handleCancel}
            className='deleteElementsBoard__btn deleteElementsBoard__btn--cancel'>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
