const MessageItem = ({ message }) => {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[80%] rounded-xl px-4 py-3 shadow-md ${
          isUser
            ? 'bg-accent-gold text-black'
            : 'bg-gray-100 text-black border-2 border-accent-gold/30'
        }`}
      >
        <p className="text-sm leading-relaxed">{message.content}</p>
        {message.timestamp && (
          <p className={`text-xs mt-2 ${isUser ? 'text-black/60' : 'text-gray-500'}`}>
            {new Date(message.timestamp).toLocaleTimeString()}
          </p>
        )}
      </div>
    </div>
  )
}

export default MessageItem
