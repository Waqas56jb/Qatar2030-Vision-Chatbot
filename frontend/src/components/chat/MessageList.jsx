import MessageItem from './MessageItem'

const MessageList = ({ messages, isLoading }) => {
  return (
    <div className="flex-1 overflow-y-auto mb-4 pr-2 scrollbar-thin scrollbar-thumb-accent-gold/30 scrollbar-track-gray-100">
      {messages.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-4 bg-accent-gold/20 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-accent-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p className="text-gray-700 text-lg font-semibold mb-2">Welcome to Qatar 2030 Vision Chatbot</p>
          <p className="text-gray-600 text-sm mb-4">Ask me anything about Qatar National Vision 2030</p>
          <div className="flex flex-wrap gap-2 justify-center text-xs text-gray-500">
            <span className="px-3 py-1 bg-gray-100 rounded-full">Four Pillars</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full">NDS Strategies</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full">Development Goals</span>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((message, index) => (
            <MessageItem key={index} message={message} />
          ))}
        </div>
      )}
      {isLoading && (
        <div className="flex items-center gap-3 text-gray-600 py-4">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-accent-gold border-t-transparent"></div>
          <span className="font-medium">AI is thinking...</span>
        </div>
      )}
    </div>
  )
}

export default MessageList
