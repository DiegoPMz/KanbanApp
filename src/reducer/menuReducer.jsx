import { currentTheme } from '../helpers/currentTheme'
import { generateUUID } from '../helpers/generateUUID'
import { saveLocalStorage } from '../helpers/saveLocalStorage'
import { validationBoard } from '../helpers/validationBoard'
import { validationEditBoard } from '../helpers/validationEditBoard'
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
    subtasks: [{ content: '', id: generateUUID() }],
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
      return {
        ...state,
        editBoardModalActive: false,
        settingsModalActive: false,
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
            { content: '', id: generateUUID() },
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

      const modifiedCurrentBoard = {
        ...state.currentBoard[0],
        boardColumns: [
          ...state.currentBoard[0].boardColumns.map((column) =>
            column.name === state.newTask.status
              ? {
                  ...column,
                  task: [...column.task, { ...state.newTask }],
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
          subtasks: [{ content: '', id: generateUUID() }],
          status: '',
          id: generateUUID(),
        },
        currentBoard: [modifiedCurrentBoard],
        allBoards: newAllBoardsState,
        createNewTask: false,
      }
    }

    default:
      break
  }
}
