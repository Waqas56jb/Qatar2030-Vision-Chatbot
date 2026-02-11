import { useEffect } from 'react'
import { AppProvider } from './contexts/AppContext'
import { ChatbotProvider } from './contexts/ChatbotContext'
import { LanguageProvider, useLanguage } from './contexts/LanguageContext'
import { useChatbot } from './contexts/ChatbotContext'
import FullScreenChatbot from './components/chat/FullScreenChatbot'
import DoctorChatbot from './components/chat/DoctorChatbot'

const ChatbotSwitcher = () => {
  const { chatbotType } = useChatbot()

  return chatbotType === 'doctor' ? <DoctorChatbot /> : <FullScreenChatbot />
}

const AppContent = () => {
  const { language } = useLanguage()

  useEffect(() => {
    // Set document direction for RTL languages (Arabic)
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = language
  }, [language])

  return <ChatbotSwitcher />
}

function App() {
  return (
    <AppProvider>
      <LanguageProvider>
        <ChatbotProvider>
          <AppContent />
        </ChatbotProvider>
      </LanguageProvider>
    </AppProvider>
  )
}

export default App
