const ChatHeader = ({ onClose }) => {
  return (
    <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b-2 border-accent-gold/30 bg-gradient-to-r from-accent-gold/10 to-white rounded-t-2xl">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-accent-gold rounded-full flex items-center justify-center shadow-md">
          <span className="text-black font-bold text-lg">Q</span>
        </div>
        <div>
          <h2 className="text-xl font-bold text-black">
            Qatar 2030 <span className="text-accent-gold">Chatbot</span>
          </h2>
          <p className="text-xs text-gray-500">Ask about Vision 2030</p>
        </div>
      </div>
      <button
        onClick={onClose}
        className="text-gray-500 hover:text-black transition-colors p-2 hover:bg-accent-gold/20 rounded-lg"
        aria-label="Close chat"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

export default ChatHeader
