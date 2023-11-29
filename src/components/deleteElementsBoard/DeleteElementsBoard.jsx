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
      className='deleteBoard__container'>
      <div className='deleteBoard'>
        {children}
        <div className='deleteBoard_btnContainer'>
          <button
            onClick={handleDelete && handleDelete}
            className='deleteBoard__btn deleteBoard__btn--delete'>
            Delete
          </button>
          <button
            onClick={handleCancel && handleCancel}
            className='deleteBoard__btn deleteBoard__btn--cancel'>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
