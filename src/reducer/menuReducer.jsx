import { currentTheme } from '../helpers/currentTheme'
import { generateUUID } from '../helpers/generateUUID'

export const menuState = {
  menuActive: false,
  menuTheme: currentTheme(),
  createBoardActive: false,
  currentBoard: null,
  allBoards: [],
  newBoard: {
    boardName: '',
    boardColumns: [{ name: '', id: generateUUID(), task: [] }],
    boardId: null,
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
      const columnsLength = state.newBoard.boardColumns.length
      const validateNameColumn = state.newBoard.boardColumns.filter(
        (column) => column.name === '',
      )

      if (columnsLength === validateNameColumn.length) return { ...state }

      return {
        ...state,
        createBoardActive: false,
        allBoards: [
          ...state.allBoards,
          { ...state.newBoard, boardId: generateUUID() },
        ],
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
    case 'currentBoard-phone': {
      return {
        ...state,
        menuActive: false,
        currentBoard: { ...action.payload },
      }
    }
    case 'currentBoard-dekstop': {
      return { ...state, currentBoard: { ...action.payload } }
    }

    default:
      break
  }
}

// const allBoardsLocalStorage = localStorage.getItem('all_boards_storage')
// ? [
//     ...JSON.parse(localStorage.getItem('all_boards_storage')),
//     { ...state.newBoard, boardId: generateUUID() },
//   ]
// : [...state.allBoards, { ...state.newBoard, boardId: generateUUID() }]

// localStorage.setItem(
// 'all_boards_storage',
// JSON.stringify(allBoardsLocalStorage),
// )
