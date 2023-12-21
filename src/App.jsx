import './App.css'
import { KanbanApp } from './components/kanbanApp/KanbanApp'
import { MenuContextProvider } from './context/MenuContext'

function App() {
  return (
    <MenuContextProvider>
      <KanbanApp />
    </MenuContextProvider>
  )
}

export default App
