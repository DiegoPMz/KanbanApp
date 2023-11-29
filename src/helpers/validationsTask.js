const errorDefault = { status: false, title: false }

export const validationsTask = () => {
  const addNewTask = document.querySelector('.addNewTask')
  if (!addNewTask) return

  const titleTask = addNewTask.querySelector('#addNewTaskForm-input-title')
  const statusTask = addNewTask.querySelector('#addNewTaskForm-select-column')
  let error = { ...errorDefault }

  if (titleTask.value.length < 1) {
    titleTask.classList.add('addNewTaskForm-input--error')

    error = { ...error, title: true }
  } else if (titleTask.value.length > 1) {
    titleTask.classList.remove('addNewTaskForm-input--error')
    error = { ...error, title: false }
  }

  if (!statusTask.value) {
    statusTask.classList.add('addNewTaskForm-input--error')

    error = { ...error, status: true }
  } else if (statusTask.value) {
    statusTask.classList.remove('addNewTaskForm-input--error')
    error = { ...error, status: false }
  }

  return { error }
}
