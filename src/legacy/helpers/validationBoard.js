const errorDefault = { errColumn: false, errBoardName: false }

export const validationBoard = () => {
  const containerExist = document.querySelector('.addBoardForm')
  if (!containerExist) return

  let error = { ...errorDefault }

  const columnsValues = containerExist.querySelectorAll(
    '#addBoardForm-input-ColumnName',
  )
  const nullColumnValue = Object.values(columnsValues).filter(
    (column) => !column.value,
  )
  const correctColumnValues = Object.values(columnsValues).filter(
    (column) => column.value !== '',
  )

  const boardNameValue = containerExist.querySelector(
    '#addBoardForm-input-name',
  )

  if (nullColumnValue.length >= 1) {
    nullColumnValue.map((el) =>
      el.classList.add('boardform-containerName__input--error'),
    )

    error = { ...error, errColumn: true }
  }

  if (correctColumnValues.length > 0) {
    correctColumnValues.map(
      (el) =>
        el.classList.contains('boardform-containerName__input--error') &&
        el.classList.remove('boardform-containerName__input--error'),
    )

    error = { ...error, errColumn: false }
  }

  if (!boardNameValue.value) {
    boardNameValue.classList.add('boardform-containerName__input--error')
    error = { ...error, errBoardName: true }
  } else if (boardNameValue.value) {
    boardNameValue.classList.contains(
      'boardform-containerName__input--error',
    ) &&
      boardNameValue.classList.remove('boardform-containerName__input--error')
    error = { ...error, errBoardName: false }
  }

  return { error }
}
