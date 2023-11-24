// const showLocalStorage = (key) => {
//   if (!localStorage.getItem(key)) {

//   }
// }
// const modifiedLocalStorage = (key, data) => {}

export const saveLocalStorage = ({ key, data = null }) => {
  if (!localStorage.getItem(key) && !data) {
    console.log('CREANDO LOCAL-STORAGE')
    localStorage.setItem(key, JSON.stringify([]))
    return JSON.parse(localStorage.getItem(key))
  }

  if (localStorage.getItem(key) && !data) {
    console.log('MOSTRANDO LOCAL-STORAGE')
    return JSON.parse(localStorage.getItem(key))
  }

  if (localStorage.getItem(key) && data) {
    console.log('ACTUALIZANDO LOCAL-STORAGE')
    localStorage.setItem(key, JSON.stringify(data))

    return JSON.parse(localStorage.getItem(key))
  }

  // if (localStorage.getItem(key) && data) {
  //   console.log('ACTUALIZANDO LOCAL-STORAGE')
  //   const parseData = JSON.parse(localStorage.getItem(key))

  //   const filterData = parseData.find(
  //     (board) =>
  //       board.boardId === data.boardId && board.boardName === data.boardName,
  //   )

  //   if (filterData) return parseData

  //   const setNewData = [...parseData, data]
  //   localStorage.setItem(key, JSON.stringify(setNewData))
  //   return setNewData
  // }
}
