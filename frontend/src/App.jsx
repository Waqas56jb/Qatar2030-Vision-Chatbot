import { AppProvider } from './contexts/AppContext'
import FullScreenChatbot from './components/chat/FullScreenChatbot'

function App() {
  return (
    <AppProvider>
      <FullScreenChatbot />
    </AppProvider>
  )
}

export default App
