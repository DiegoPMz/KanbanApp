const errorDefault = { errColumn: false, errBoardName: false }

export const validationEditBoard = () => {
  const containerExist = document.querySelector('.editBoardModal')
  if (!containerExist) return

  let error = { ...errorDefault }
  const CLASS_INPUT_ERROR = 'editBoard-containerName__input--error'

  const boardNameValue = containerExist.querySelector(
    '#editBoardModal-input-name',
  )

  const columnsValues = containerExist.querySelectorAll(
    '#editBoard-input-ColumnName',
  )
  const nullColumnValue = Object.values(columnsValues).filter(
    (column) => !column.value,
  )
  const correctColumnValues = Object.values(columnsValues).filter(
    (column) => column.value !== '',
  )

  if (nullColumnValue.length > 0) {
    nullColumnValue.map((el) => el.classList.add(CLASS_INPUT_ERROR))

    error = { ...error, errColumn: true }
  }

  if (correctColumnValues.length > 0) {
    correctColumnValues.map(
      (el) =>
        el.classList.contains(CLASS_INPUT_ERROR) &&
        el.classList.remove(CLASS_INPUT_ERROR),
    )

    if (nullColumnValue.length < 1) {
      error = { ...error, errColumn: false }
    } else {
      error = { ...error, errColumn: true }
    }
  }

  if (!boardNameValue.value) {
    boardNameValue.classList.add(CLASS_INPUT_ERROR)
    error = { ...error, errBoardName: true }
  } else if (boardNameValue.value) {
    boardNameValue.classList.contains(CLASS_INPUT_ERROR) &&
      boardNameValue.classList.remove(CLASS_INPUT_ERROR)
    error = { ...error, errBoardName: false }
  }

  return { error }
}
