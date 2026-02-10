const ChatHeader = ({ onClear }) => {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-accent-gold rounded-full flex items-center justify-center shadow-lg">
          <span className="text-black font-bold text-xl">Q</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-black">
            Qatar 2030 <span className="text-accent-gold">Vision Chatbot</span>
          </h1>
          <p className="text-sm text-gray-600">Ask about QNV 2030, NDS strategies & development goals</p>
        </div>
      </div>
      {onClear && (
        <button
          onClick={onClear}
          className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-black hover:bg-accent-gold/20 rounded-lg transition-colors flex items-center gap-2"
          aria-label="Clear chat"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Clear Chat
        </button>
      )}
    </div>
  )
}

export default ChatHeader
