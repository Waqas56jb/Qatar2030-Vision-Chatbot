import MessageItem from './MessageItem'
import { useChatbot } from '../../contexts/ChatbotContext'
import { useLanguage } from '../../contexts/LanguageContext'

const MessageList = ({ messages, isLoading }) => {
  const { chatbotType } = useChatbot()
  const { t } = useLanguage()
  const theme = chatbotType === 'doctor' ? 'green' : 'gold'
  const isDoctor = chatbotType === 'doctor'
  const chatbotKey = isDoctor ? 'doctor' : 'qatar2030'

  return (
    <div className={`h-full overflow-y-auto pr-2 scrollbar-thin ${isDoctor ? 'scrollbar-thumb-green-400/30' : 'scrollbar-thumb-accent-gold/30'} scrollbar-track-gray-100`}>
      {messages.length === 0 ? (
        <div className="h-full flex items-center justify-center">
          <div className="text-center max-w-2xl px-4">
          <div className={`w-20 h-20 mx-auto mb-4 ${isDoctor ? 'bg-green-500/20' : 'bg-accent-gold/20'} rounded-full flex items-center justify-center`}>
            <svg className={`w-10 h-10 ${isDoctor ? 'text-green-500' : 'text-accent-gold'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isDoctor ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              )}
            </svg>
          </div>
          <p className="text-gray-700 text-lg font-semibold mb-2">
            {t('welcome', chatbotKey)}
          </p>
          <p className="text-gray-600 text-sm mb-4">
            {t('askAnything', chatbotKey)}
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-4">
            {isDoctor ? (
              <>
                <span className={`px-4 py-2 ${isDoctor ? 'bg-green-500/20' : 'bg-accent-gold/20'} text-black rounded-full text-sm font-medium`}>{t('pediatric', chatbotKey)}</span>
                <span className={`px-4 py-2 ${isDoctor ? 'bg-green-500/20' : 'bg-accent-gold/20'} text-black rounded-full text-sm font-medium`}>{t('emergency', chatbotKey)}</span>
                <span className={`px-4 py-2 ${isDoctor ? 'bg-green-500/20' : 'bg-accent-gold/20'} text-black rounded-full text-sm font-medium`}>{t('specialist', chatbotKey)}</span>
              </>
            ) : (
              <>
                <span className={`px-4 py-2 ${isDoctor ? 'bg-green-500/20' : 'bg-accent-gold/20'} text-black rounded-full text-sm font-medium`}>{t('fourPillars', chatbotKey)}</span>
                <span className={`px-4 py-2 ${isDoctor ? 'bg-green-500/20' : 'bg-accent-gold/20'} text-black rounded-full text-sm font-medium`}>{t('ndsStrategies', chatbotKey)}</span>
                <span className={`px-4 py-2 ${isDoctor ? 'bg-green-500/20' : 'bg-accent-gold/20'} text-black rounded-full text-sm font-medium`}>{t('qnv2030', chatbotKey)}</span>
              </>
            )}
          </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((message, index) => (
            <MessageItem key={index} message={message} theme={theme} />
          ))}
        </div>
      )}
      {isLoading && (
        <div className="flex items-center gap-3 text-gray-600 py-4">
          <div className={`animate-spin rounded-full h-5 w-5 border-2 ${isDoctor ? 'border-green-500' : 'border-accent-gold'} border-t-transparent`}></div>
          <span className="font-medium">{t('thinking', chatbotKey)}</span>
        </div>
      )}
    </div>
  )
}

export default MessageList
