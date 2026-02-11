import { createContext, useContext, useState } from 'react'

const ChatbotContext = createContext()

export const ChatbotProvider = ({ children }) => {
  const [chatbotType, setChatbotType] = useState('qatar2030') // 'qatar2030' or 'doctor'

  const switchChatbot = (type) => {
    setChatbotType(type)
  }

  return (
    <ChatbotContext.Provider value={{ chatbotType, switchChatbot }}>
      {children}
    </ChatbotContext.Provider>
  )
}

export const useChatbot = () => {
  const context = useContext(ChatbotContext)
  if (!context) {
    throw new Error('useChatbot must be used within ChatbotProvider')
  }
  return context
}
