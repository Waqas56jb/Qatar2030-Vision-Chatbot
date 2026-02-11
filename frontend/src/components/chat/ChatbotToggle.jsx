import { useLanguage } from '../../contexts/LanguageContext'

const ChatbotToggle = ({ chatbotType, onSwitch }) => {
  const { language } = useLanguage()
  
  // Simple translations for toggle buttons
  const labels = {
    ar: { qatar2030: 'قطر 2030', doctor: 'البحث عن طبيب' },
    en: { qatar2030: 'Qatar 2030', doctor: 'Doctor Finder' },
  }

  return (
    <div className="flex items-center gap-3 bg-white rounded-full p-1 shadow-md border border-gray-200">
      <button
        onClick={() => onSwitch('qatar2030')}
        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
          chatbotType === 'qatar2030'
            ? 'bg-accent-gold text-black shadow-md'
            : 'text-gray-600 hover:text-black hover:bg-gray-50'
        }`}
      >
        {labels[language]?.qatar2030 || 'Qatar 2030'}
      </button>
      <button
        onClick={() => onSwitch('doctor')}
        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
          chatbotType === 'doctor'
            ? 'bg-green-500 text-white shadow-md'
            : 'text-gray-600 hover:text-black hover:bg-gray-50'
        }`}
      >
        {labels[language]?.doctor || 'Doctor Finder'}
      </button>
    </div>
  )
}

export default ChatbotToggle
