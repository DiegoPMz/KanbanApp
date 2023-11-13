import './App.css'
import { KanbanApp } from './components/kanbanApp/KanbanApp'
import { MenuContextProvider } from './context/menuContext'

function App() {
  return (
    <MenuContextProvider>
      <KanbanApp />
    </MenuContextProvider>
  )
}

export default App
