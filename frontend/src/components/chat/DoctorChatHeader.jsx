import ChatbotToggle from './ChatbotToggle'
import LanguageSwitcher from './LanguageSwitcher'
import { useChatbot } from '../../contexts/ChatbotContext'
import { useLanguage } from '../../contexts/LanguageContext'

const DoctorChatHeader = ({ onClear }) => {
  const { chatbotType, switchChatbot } = useChatbot()
  const { t } = useLanguage()

  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-black">
            {t('title', 'doctor')} <span className="text-green-500">{t('subtitle', 'doctor')}</span>
          </h1>
          <p className="text-sm text-gray-600">{t('description', 'doctor')}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <LanguageSwitcher />
        <ChatbotToggle chatbotType={chatbotType} onSwitch={switchChatbot} />
        {onClear && (
          <button
            onClick={onClear}
            className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-black hover:bg-green-50 rounded-lg transition-colors flex items-center gap-2"
            aria-label="Clear chat"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            {t('clearChat', 'doctor')}
          </button>
        )}
      </div>
    </div>
  )
}

export default DoctorChatHeader
