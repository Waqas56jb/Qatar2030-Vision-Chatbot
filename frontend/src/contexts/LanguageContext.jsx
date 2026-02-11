import { createContext, useContext, useState } from 'react'

const LanguageContext = createContext()

const translations = {
  ar: {
    // Qatar 2030 Chatbot
    qatar2030: {
      title: 'قطر 2030',
      subtitle: 'رؤية قطر الوطنية',
      description: 'اسأل عن رؤية قطر 2030، استراتيجيات NDS وأهداف التنمية',
      placeholder: 'اسأل عن رؤية قطر 2030...',
      clearChat: 'مسح المحادثة',
      welcome: 'مرحباً بك في روبوت رؤية قطر 2030',
      askAnything: 'اسألني أي شيء عن رؤية قطر الوطنية 2030',
      thinking: 'جاري التفكير...',
      fourPillars: 'الأركان الأربعة',
      ndsStrategies: 'استراتيجيات NDS',
      qnv2030: 'رؤية قطر 2030',
    },
    // Doctor Chatbot
    doctor: {
      title: 'توصية الطبيب',
      subtitle: 'البحث عن طبيب',
      description: 'ابحث عن طبيب متخصص في Sidra Medicine',
      placeholder: 'ابحث عن طبيب متخصص...',
      clearChat: 'مسح المحادثة',
      welcome: 'مرحباً بك في روبوت توصية الأطباء',
      askAnything: 'ابحث عن طبيب متخصص في Sidra Medicine',
      thinking: 'جار البحث...',
      pediatric: 'أطفال',
      emergency: 'طوارئ',
      specialist: 'متخصص',
    },
    // Common
    common: {
      send: 'إرسال',
      loading: 'جاري التحميل...',
    },
  },
  en: {
    qatar2030: {
      title: 'Qatar 2030',
      subtitle: 'Vision Chatbot',
      description: 'Ask about QNV 2030, NDS strategies & development goals',
      placeholder: 'Ask about Qatar 2030 Vision...',
      clearChat: 'Clear Chat',
      welcome: 'Welcome to Qatar 2030 Vision Chatbot',
      askAnything: 'Ask me anything about Qatar National Vision 2030',
      thinking: 'AI is thinking...',
      fourPillars: 'Four Pillars',
      ndsStrategies: 'NDS Strategies',
      qnv2030: 'QNV 2030',
    },
    doctor: {
      title: 'Doctor',
      subtitle: 'Recommendation',
      description: 'Find a specialist doctor at Sidra Medicine',
      placeholder: 'Search for a specialist doctor...',
      clearChat: 'Clear Chat',
      welcome: 'Welcome to Doctor Recommendation Chatbot',
      askAnything: 'Find a specialist doctor at Sidra Medicine',
      thinking: 'Searching...',
      pediatric: 'Pediatric',
      emergency: 'Emergency',
      specialist: 'Specialist',
    },
    common: {
      send: 'Send',
      loading: 'Loading...',
    },
  },
}

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('ar') // Default Arabic

  const t = (key, chatbotType = 'qatar2030') => {
    return translations[language]?.[chatbotType]?.[key] || translations[language]?.common?.[key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
