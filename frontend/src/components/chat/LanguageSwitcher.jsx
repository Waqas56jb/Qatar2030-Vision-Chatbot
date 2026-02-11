import { useLanguage } from '../../contexts/LanguageContext'

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage()

  const languages = [
    { code: 'ar', label: 'العربية', flag: '🇸🇦' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
  ]

  return (
    <div className="flex items-center gap-2 bg-white rounded-full p-1 shadow-md border border-gray-200">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 flex items-center gap-1.5 ${
            language === lang.code
              ? 'bg-accent-gold text-black shadow-sm'
              : 'text-gray-600 hover:text-black hover:bg-gray-50'
          }`}
          title={lang.label}
        >
          <span>{lang.flag}</span>
          <span className="hidden sm:inline">{lang.label}</span>
        </button>
      ))}
    </div>
  )
}

export default LanguageSwitcher
