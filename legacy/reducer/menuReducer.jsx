import { arrayMove } from '@dnd-kit/sortable'
import { currentTheme } from '../helpers/currentTheme'
import { generateUUID } from '../helpers/generateUUID'
import { saveLocalStorage } from '../helpers/saveLocalStorage'
import { validationBoard } from '../helpers/validationBoard'
import { validationEditBoard } from '../helpers/validationEditBoard'
import { validationEditTask } from '../helpers/validationEditTask'
import { validationsTask } from '../helpers/validationsTask'

const KEY_SAVE_ALLBOARDS = 'KEY_SAVE_ALLBOARDS'

export const menuState = {
  menuActive: false,
  menuTheme: currentTheme(),
  createBoardActive: false,
  createNewTask: false,
  settingsModalActive: false,
  currentBoard: null,
  deleteBoardModalActive: false,
  editBoardModalActive: false,
  completeTaskModalActive: false,
  currentTask: null,
  optionsEditTaskModalActive: false,
  deleteTaskModalActive: false,
  editTaskModalActive: false,

  allBoards: [
    ...saveLocalStorage({
      key: KEY_SAVE_ALLBOARDS,
    }),
  ],
  newBoard: {
    boardName: '',
    boardColumns: [{ name: '', id: generateUUID(), task: [] }],
    boardId: null,
  },

  newTask: {
    title: '',
    description: '',
    subtasks: [{ content: '', id: generateUUID(), status: 'pending' }],
    status: '',
    id: generateUUID(),
  },
}

export const menuReducer = (state, action) => {
  switch (action.type) {
    case 'showMenu': {
      return { ...state, menuActive: !state.menuActive }
    }
    case 'changeTheme': {
      const bodyElement = document.querySelector('body')

      const changeThemeColor = {
        dark: () => {
          bodyElement.setAttribute('id', 'dark-theme')
        },

        ligth: () => {
          bodyElement.setAttribute('id', 'ligth-theme')
        },
      }

      const changeState = state.menuTheme === 'dark' ? 'ligth' : 'dark'

      const setIdTheme = changeThemeColor[changeState]
      setIdTheme && setIdTheme()

      return {
        ...state,
        menuTheme: setIdTheme ? changeState : state.menuTheme,
      }
    }
    case 'clickCreateBoard-phone': {
      return {
        ...state,
        menuActive: false,
        createBoardActive: !state.createBoardActive,
      }
    }
    case 'clickCreateBoard-dekstop': {
      return {
        ...state,
        createBoardActive: !state.createBoardActive,
      }
    }

    // CREATE-NEW-BOARD
    case 'captureValuesNewBoard': {
      const { target, id } = action.payload
      const { name, value } = target

      if (name === 'boardName') {
        return { ...state, newBoard: { ...state.newBoard, [name]: value } }
      }

      if (name === 'newColumnName') {
        return {
          ...state,
          newBoard: {
            ...state.newBoard,
            boardColumns: state.newBoard.boardColumns.map((column) =>
              column.id === id ? { ...column, name: value } : column,
            ),
          },
        }
      }
      break
    }
    case 'createNewColumn': {
      return {
        ...state,
        newBoard: {
          ...state.newBoard,
          boardColumns: [
            ...state.newBoard.boardColumns,
            { name: '', id: generateUUID(), task: [] },
          ],
        },
      }
    }
    case 'deleteColumn': {
      const { id } = action.payload

      const newColumns = state.newBoard.boardColumns.filter(
        (column) => column.id !== id,
      )

      const columnsLength = state.newBoard.boardColumns.length

      return {
        ...state,
        newBoard: {
          ...state.newBoard,
          boardColumns:
            columnsLength > 1 ? newColumns : [...state.newBoard.boardColumns],
        },
      }
    }
    case 'addNewBoard': {
      const { error } = validationBoard()
      if (error.errColumn || error.errBoardName) return { ...state }

      const newStateLocalStorage = [
        ...state.allBoards,
        { ...state.newBoard, boardId: generateUUID() },
      ]

      const newAllBoardsState = saveLocalStorage({
        key: KEY_SAVE_ALLBOARDS,
        data: newStateLocalStorage,
      })

      return {
        ...state,
        createBoardActive: false,
        allBoards: [...newAllBoardsState],
        newBoard: {
          boardName: '',
          boardColumns: [{ name: '', id: generateUUID(), task: [] }],
          boardId: null,
        },
      }
    }
    case 'resetValuesNewBoard': {
      return {
        ...state,
        newBoard: {
          boardName: '',
          boardColumns: [{ name: '', id: generateUUID(), task: [] }],
          boardId: null,
        },
      }
    }
    case 'deleteBoardModalShow': {
      return { ...state, deleteBoardModalActive: true }
    }
    case 'deleteBoardModalClose': {
      return {
        ...state,
        deleteBoardModalActive: false,
        settingsModalActive: false,
      }
    }

    // SELECT-CURRENT-BOARD
    case 'currentBoard-phone': {
      return {
        ...state,
        menuActive: false,
        currentBoard: [{ ...action.payload }],
      }
    }
    case 'currentBoard-dekstop': {
      return { ...state, currentBoard: [{ ...action.payload }] }
    }

    // EDIT CURRENT-BOARD
    case 'deleteCurrentBoard': {
      const deleteCurrentBoard = state.allBoards.filter(
        (board) => board.boardId !== state.currentBoard[0].boardId,
      )

      const newAllBoardsState = saveLocalStorage({
        key: KEY_SAVE_ALLBOARDS,
        data: deleteCurrentBoard,
      })

      return {
        ...state,
        settingsModalActive: false,
        deleteBoardModalActive: false,
        currentBoard: null,
        allBoards: [...newAllBoardsState],
      }
    }
    case 'captureValuesEditBoard': {
      const { target, id } = action.payload
      const { name, value } = target

      if (name === 'boardName') {
        return {
          ...state,
          currentBoard: [{ ...state.currentBoard[0], boardName: value }],
        }
      }

      if (name === 'columnName') {
        return {
          ...state,
          currentBoard: [
            {
              ...state.currentBoard[0],
              boardColumns: state.currentBoard[0].boardColumns.map((column) =>
                column.id === id ? { ...column, name: value } : { ...column },
              ),
            },
          ],
        }
      }

      break
    }
    case 'editBoardCreateNewColumn': {
      return {
        ...state,
        currentBoard: [
          {
            ...state.currentBoard[0],
            boardColumns: [
              ...state.currentBoard[0].boardColumns,
              { name: '', id: generateUUID(), task: [] },
            ],
          },
        ],
      }
    }
    case 'editBoardDeleteColumn': {
      if (state.currentBoard[0].boardColumns.length <= 1) return { ...state }

      const { id } = action.payload

      const deleteColumn = state.currentBoard[0].boardColumns.filter(
        (column) => column.id !== id,
      )

      return {
        ...state,
        currentBoard: [
          {
            ...state.currentBoard[0],
            boardColumns: [...deleteColumn],
          },
        ],
      }
    }
    case 'editBoardSubmitData': {
      const { error } = validationEditBoard()
      if (error.errColumn || error.errBoardName) return { ...state }

      const currentBoardId = state.currentBoard[0].boardId
      const updateAllBoards = state.allBoards.map((board) =>
        board.boardId === currentBoardId
          ? { ...state.currentBoard[0] }
          : { ...board },
      )

      const newAllBoardsState = saveLocalStorage({
        key: KEY_SAVE_ALLBOARDS,
        data: updateAllBoards,
      })

      return {
        ...state,
        editBoardModalActive: false,
        settingsModalActive: false,
        allBoards: [...newAllBoardsState],
      }
    }

    case 'settingsModalActive': {
      return { ...state, settingsModalActive: !state.settingsModalActive }
    }
    case 'editBoardModalShow': {
      return { ...state, editBoardModalActive: true }
    }
    case 'editBoardModalClose': {
      const getCurrentBoard = state.allBoards.filter(
        (board) => board.boardId === state.currentBoard[0].boardId,
      )

      return {
        ...state,
        currentBoard: getCurrentBoard,
        editBoardModalActive: false,
        settingsModalActive: false,
      }
    }

    case 'dndTaskCurrentBoard': {
      const { event, column } = action.payload
      const { active, over } = event

      const columnToDnD = state.currentBoard[0].boardColumns.find(
        (col) => col.id === column.id,
      )

      const oldTaskPositions = columnToDnD.task

      const prevPosition = columnToDnD.task.findIndex(
        (task) => task.id === active.id,
      )

      const newPosition = columnToDnD.task.findIndex(
        (task) => task.id === over.id,
      )

      const taskNewOrder = arrayMove(
        oldTaskPositions,
        prevPosition,
        newPosition,
      )

      const updateCurrentBoard = {
        ...state.currentBoard[0],
        boardColumns: state.currentBoard[0].boardColumns.map((col) =>
          col.id === column.id ? { ...column, task: taskNewOrder } : { ...col },
        ),
      }

      const updateAllBoards = state.allBoards.map((board) =>
        board.boardId === updateCurrentBoard.boardId
          ? { ...updateCurrentBoard }
          : { ...board },
      )

      saveLocalStorage({
        key: KEY_SAVE_ALLBOARDS,
        data: updateAllBoards,
      })

      return {
        ...state,
        currentBoard: [{ ...updateCurrentBoard }],
        allBoards: updateAllBoards,
      }
    }

    // CREATE-NEW-TASK
    case 'createNewTaskShow': {
      return { ...state, createNewTask: true }
    }
    case 'createNewTaskClose': {
      return {
        ...state,
        createNewTask: false,
        newTask: {
          title: '',
          description: '',
          subtasks: [{ content: '', id: generateUUID() }],
          status: '',
          id: generateUUID(),
        },
      }
    }
    case 'captureValuesNewTask': {
      const { e, id } = action.payload
      const { name, value } = e.target

      if (name.includes('subTask')) {
        return {
          ...state,
          newTask: {
            ...state.newTask,
            subtasks: state.newTask.subtasks.map((sub) =>
              sub.id === id ? { ...sub, content: value } : { ...sub },
            ),
          },
        }
      }

      return { ...state, newTask: { ...state.newTask, [name]: value } }
    }
    case 'createSubTask': {
      return {
        ...state,
        newTask: {
          ...state.newTask,
          subtasks: [
            ...state.newTask.subtasks,
            { content: '', id: generateUUID(), status: 'pending' },
          ],
        },
      }
    }
    case 'deleteSubtask': {
      if (state.newTask.subtasks.length <= 1) return { ...state }

      const deleteSubtask = state.newTask.subtasks.filter(
        (sub) => sub.id !== action.payload.id,
      )

      return {
        ...state,
        newTask: { ...state.newTask, subtasks: [...deleteSubtask] },
      }
    }
    case 'submitCreateNewTask': {
      const { error } = validationsTask()
      if (error.status || error.title) return { ...state }

      const removeSubTaskEmpty = state.newTask.subtasks.filter(
        (subtask) => subtask.content !== '',
      )
      const newTask = { ...state.newTask, subtasks: removeSubTaskEmpty }

      const modifiedCurrentBoard = {
        ...state.currentBoard[0],
        boardColumns: [
          ...state.currentBoard[0].boardColumns.map((column) =>
            column.name === newTask.status
              ? {
                  ...column,
                  task: [...column.task, { ...newTask }],
                }
              : { ...column },
          ),
        ],
      }

      const setBoardtoAllBoards = state.allBoards.map((board) =>
        board.boardId === modifiedCurrentBoard.boardId
          ? { ...modifiedCurrentBoard }
          : { ...board },
      )

      const newAllBoardsState = saveLocalStorage({
        key: KEY_SAVE_ALLBOARDS,
        data: setBoardtoAllBoards,
      })

      return {
        ...state,
        newTask: {
          title: '',
          description: '',
          subtasks: [{ content: '', id: generateUUID(), status: 'pending' }],
          status: '',
          id: generateUUID(),
        },
        currentBoard: [modifiedCurrentBoard],
        allBoards: newAllBoardsState,
        createNewTask: false,
      }
    }
    // COMPLETE TASK
    case 'completeTaskModalShow': {
      const { id } = action.payload

      const currentBoardAllTasks = state.currentBoard[0].boardColumns
        .map((column) => column.task)
        .flat()

      const currentTask = currentBoardAllTasks.find((task) => task.id === id)

      return {
        ...state,
        completeTaskModalActive: true,
        currentTask: { ...currentTask },
      }
    }
    case 'completeTaskModalClose': {
      const findColumnCurrentTask = state.currentBoard[0].boardColumns.find(
        (column) =>
          column.task.find((task) => task.id === state.currentTask.id),
      )

      let updateCurrentBoard

      if (findColumnCurrentTask.name === state.currentTask.status) {
        updateCurrentBoard = state.currentBoard[0].boardColumns.map((column) =>
          column.name === state.currentTask.status
            ? {
                ...column,
                task: column.task.map((task) =>
                  task.id === state.currentTask.id
                    ? { ...state.currentTask }
                    : { ...task },
                ),
              }
            : { ...column },
        )
      }
      //
      else if (findColumnCurrentTask.name !== state.currentTask.status) {
        const removeCurrentTask = {
          ...findColumnCurrentTask,
          task: findColumnCurrentTask.task.filter(
            (task) => task.id !== state.currentTask.id,
          ),
        }

        const updateColumns = state.currentBoard[0].boardColumns.map(
          (column) =>
            column.id === removeCurrentTask.id
              ? { ...removeCurrentTask }
              : { ...column },
        )

        updateCurrentBoard = updateColumns.map((column) =>
          column.name === state.currentTask.status
            ? { ...column, task: [...column.task, { ...state.currentTask }] }
            : { ...column },
        )
      }

      const updateAllBoards = state.allBoards.map((board) =>
        board.boardId === state.currentBoard[0].boardId
          ? { ...state.currentBoard[0], boardColumns: updateCurrentBoard }
          : { ...board },
      )

      const newAllBoardsState = saveLocalStorage({
        key: KEY_SAVE_ALLBOARDS,
        data: updateAllBoards,
      })

      return {
        ...state,
        currentBoard: [
          { ...state.currentBoard[0], boardColumns: updateCurrentBoard },
        ],
        currentTask: null,
        completeTaskModalActive: false,
        editTaskModalActive: false,
        optionsEditTaskModalActive: state.optionsEditTaskModalActive && false,
        allBoards: newAllBoardsState,
      }
    }
    case 'onChangeCompleteTask': {
      const { target, id } = action.payload
      const { name, value } = target

      if (name === 'subtask_status') {
        const SUBTASK_COMPLETE = 'complete'
        const SUBTASK_PENDIGN = 'pending'

        // const addNewStatus = state.currentTask.subtasks.map((sub) =>
        //   sub.id === id
        //     ? {
        //         ...sub,
        //         status:
        //           sub.status === SUBTASK_PENDIGN
        //             ? SUBTASK_COMPLETE
        //             : SUBTASK_PENDIGN,
        //       }
        //     : { ...sub },
        // )

        // const getColmunModified = state.currentBoard[0].boardColumns.find(
        //   (column) =>
        //     column.task.find((task) => task.id === state.currentTask.id),
        // )

        // const setNewValuesTask = {
        //   ...getColmunModified,
        //   task: [
        //     ...getColmunModified.task.map((task) =>
        //       task.id === state.currentTask.id
        //         ? { ...state.currentTask, subtasks: [...addNewStatus] }
        //         : { ...task },
        //     ),
        //   ],
        // }

        // const addNewTaskState = state.currentBoard[0].boardColumns.map(
        //   (column) =>
        //     column.name === setNewValuesTask.name
        //       ? { ...setNewValuesTask }
        //       : { ...column },
        // )

        // return {
        //   ...state,
        //   currentTask: { ...state.currentTask, subtasks: [...addNewStatus] },
        //   currentBoard: [
        //     { ...state.currentBoard[0], boardColumns: [...addNewTaskState] },
        //   ],
        // }

        const addNewStatus = state.currentTask.subtasks.map((sub) =>
          sub.id === id
            ? {
                ...sub,
                status:
                  sub.status === SUBTASK_PENDIGN
                    ? SUBTASK_COMPLETE
                    : SUBTASK_PENDIGN,
              }
            : { ...sub },
        )

        return {
          ...state,
          currentTask: { ...state.currentTask, subtasks: [...addNewStatus] },
        }
      }

      if (name === 'task_status') {
        return {
          ...state,
          currentTask: { ...state.currentTask, status: value },
        }
      }

      break
    }

    // EDIT TASK

    case 'editCurrentTaskModalActive': {
      return {
        ...state,
        optionsEditTaskModalActive: !state.optionsEditTaskModalActive,
      }
    }
    case 'deleteCurrentTaskModalActive': {
      return {
        ...state,
        optionsEditTaskModalActive: false,
        deleteTaskModalActive: !state.deleteTaskModalActive,
      }
    }
    case 'deleteCurrentTaskModalClose': {
      return {
        ...state,
        editTaskModalActive: false,
        deleteTaskModalActive: false,
      }
    }
    case 'deleteCurrentTask': {
      const columnsDeleteTask = state.currentBoard[0].boardColumns.map(
        (column) =>
          column.task.find((task) => task.id !== state.currentTask.id)
            ? {
                ...column,
                task: column.task.filter(
                  (task) => task.id !== state.currentTask.id,
                ),
              }
            : { ...column },
      )

      const newCurrentBoard = [
        { ...state.currentBoard[0], boardColumns: columnsDeleteTask },
      ]

      const updateAllBoards = state.allBoards.map((board) =>
        board.boardId === state.currentBoard[0].boardId
          ? { ...newCurrentBoard[0] }
          : { ...board },
      )

      const newAllBoardsState = saveLocalStorage({
        key: KEY_SAVE_ALLBOARDS,
        data: updateAllBoards,
      })

      return {
        ...state,
        currentBoard: newCurrentBoard,
        completeTaskModalActive: false,
        deleteTaskModalActive: false,
        currentTask: null,
        allBoards: newAllBoardsState,
      }
    }
    case 'editTaskModalShow': {
      return {
        ...state,
        optionsEditTaskModalActive: false,
        editTaskModalActive: true,
      }
    }
    case 'editTaskModalClose': {
      const searchCurrentTask = state.currentBoard[0].boardColumns.find(
        (column) =>
          column.task.find((task) => task.id === state.currentTask.id),
      )
      const prevCurrentTask = searchCurrentTask.task.find(
        (task) => task.id === state.currentTask.id,
      )

      let taskTitle = state.currentTask.title
      let taskSubtasks = state.currentTask.subtasks

      if (!state.currentTask.title) taskTitle = prevCurrentTask.title

      if (state.currentTask.subtasks.some((sub) => sub.content === '')) {
        const emptysubTask = state.currentTask.subtasks.filter(
          (sub) => sub.content === '' && sub.id,
        )

        const resetSubtask = prevCurrentTask.subtasks.map((prev) =>
          emptysubTask.find((empty) => empty.id === prev.id)
            ? {
                ...prev,
                status: emptysubTask.find((sub) => sub.id === prev.id).status,
              }
            : { ...prev },
        )

        taskSubtasks = resetSubtask
      }

      return {
        ...state,
        currentTask: {
          ...state.currentTask,
          title: taskTitle,
          subtasks: taskSubtasks,
        },
        editTaskModalActive: false,
      }
    }
    case 'editTaskCaptureValues': {
      const { target, id } = action.payload
      const { value, name } = target

      if (name === 'subTask-editTask') {
        const subTaskEdit = state.currentTask.subtasks.map((sub) =>
          sub.id === id ? { ...sub, content: value } : { ...sub },
        )

        return {
          ...state,
          currentTask: { ...state.currentTask, subtasks: subTaskEdit },
        }
      }

      return { ...state, currentTask: { ...state.currentTask, [name]: value } }
    }
    case 'editTaskCreateNewSubtask': {
      return {
        ...state,
        currentTask: {
          ...state.currentTask,
          subtasks: [
            ...state.currentTask.subtasks,
            { content: '', id: generateUUID(), status: 'pending' },
          ],
        },
      }
    }
    case 'editTaskDeleteSubtask': {
      const { id } = action.payload

      const removeSubtask = state.currentTask.subtasks.filter(
        (sub) => sub.id !== id,
      )

      return {
        ...state,
        currentTask: {
          ...state.currentTask,
          subtasks: removeSubtask,
        },
      }
    }
    case 'editTaskSubmitNewValues': {
      const { error } = validationEditTask()
      if (error.title || error.subtask) return { ...state }

      const uptdateColumnsTaskEdit = state.currentBoard[0].boardColumns.map(
        (column) =>
          column.boardName === state.currentTask.status
            ? {
                ...column,
                task: column.task.map((task) =>
                  task.id === state.currentTask.id
                    ? { ...state.currentTask }
                    : { ...task },
                ),
              }
            : { ...column },
      )

      const updateAllBoards = state.allBoards.map((board) =>
        board.boardId === state.currentBoard[0].boardId
          ? { ...state.currentBoard[0], boardColumns: uptdateColumnsTaskEdit }
          : { ...board },
      )

      const newAllBoardsState = saveLocalStorage({
        key: KEY_SAVE_ALLBOARDS,
        data: updateAllBoards,
      })

      return {
        ...state,
        allBoards: newAllBoardsState,
        editTaskModalActive: false,
        optionsEditTaskModalActive: false,
      }
    }

    default:
      break
  }
}
