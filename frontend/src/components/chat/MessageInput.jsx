import { useState } from 'react'
import { useLanguage } from '../../contexts/LanguageContext'
import { useChatbot } from '../../contexts/ChatbotContext'

const MessageInput = ({ onSendMessage, disabled, placeholder, theme }) => {
  const { chatbotType } = useChatbot()
  const { t } = useLanguage()
  const chatbotKey = chatbotType === 'doctor' ? 'doctor' : 'qatar2030'
  
  // Use provided placeholder or get from translations
  const inputPlaceholder = placeholder || t('placeholder', chatbotKey)
  const inputTheme = theme || (chatbotType === 'doctor' ? 'green' : 'gold')
  const [message, setMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim() && !disabled) {
      onSendMessage(message.trim())
      setMessage('')
    }
  }

  const themeClasses = inputTheme === "green" 
    ? "focus:ring-green-500 focus:border-green-500 bg-green-500 hover:bg-green-600"
    : "focus:ring-accent-gold focus:border-accent-gold bg-accent-gold hover:bg-primary-600"

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="flex-1 relative">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={inputPlaceholder}
          className={`w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 ${inputTheme === "green" ? "focus:ring-green-500 focus:border-green-500" : "focus:ring-accent-gold focus:border-accent-gold"} transition-all duration-200 bg-white text-black disabled:bg-gray-50 disabled:cursor-not-allowed`}
          disabled={disabled}
        />
      </div>
      <button
        type="submit"
        disabled={disabled || !message.trim()}
        className={`w-12 h-12 ${themeClasses} text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg disabled:shadow-none`}
        aria-label="Send message"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      </button>
    </form>
  )
}

export default MessageInput
