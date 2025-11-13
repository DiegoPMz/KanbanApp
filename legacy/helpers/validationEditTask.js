const errorDefault = { title: false, subtask: false }

export const validationEditTask = () => {
  let error = { ...errorDefault }
  const TITLE_CLASS_ERROR = 'editTaskModal__title-input--error'
  const SUBTASK_CLASS_ERROR = 'inputs-subtaskInput--error'

  const containerElement = document.querySelector('.editTaskModal')
  const taskTitle = document.querySelector('#editTaskModal__title-input')

  const subtaskElements = Object.values(
    document.querySelectorAll('.editTaskModal__inputs--subtaskInput'),
  )
  const subtaskError = subtaskElements.filter((sub) => sub.value === '')
  const subtaskCorrect = subtaskElements.filter((sub) => sub.value !== '')

  if (!containerElement) return

  if (!taskTitle.value) {
    taskTitle.classList.add(TITLE_CLASS_ERROR)
    error = { ...error, title: true }
  } else {
    taskTitle.classList.contains(TITLE_CLASS_ERROR) &&
      taskTitle.classList.remove(TITLE_CLASS_ERROR)
    error = { ...error, title: false }
  }

  if (subtaskError.length >= 1) {
    subtaskError.map((sub) => sub.classList.add(SUBTASK_CLASS_ERROR))
    error = { ...error, subtask: true }
  }

  if (subtaskCorrect.length >= 1) {
    subtaskCorrect.map(
      (sub) =>
        sub.classList.contains(SUBTASK_CLASS_ERROR) &&
        sub.classList.remove(SUBTASK_CLASS_ERROR),
    )

    if (subtaskError.length === 0) error = { ...error, subtask: false }
  }

  return { error }
}
