// Simple formatting: line breaks, **bold**, numbered lists
const formatMessage = (text) => {
  if (!text) return ''
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => 
    part.startsWith('**') && part.endsWith('**') 
      ? <strong key={i}>{part.slice(2, -2)}</strong> 
      : part
  )
}

const MessageItem = ({ message }) => {
  const isUser = message.role === 'user'
  const sources = !isUser && Array.isArray(message.sources) ? message.sources : null

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[85%] rounded-xl px-5 py-4 shadow-md ${
          isUser
            ? 'bg-accent-gold text-black'
            : 'bg-gray-100 text-black border-2 border-accent-gold/30'
        }`}
      >
        <div 
          className="text-sm leading-relaxed whitespace-pre-wrap break-words"
          style={{ lineHeight: '1.7' }}
        >
          {formatMessage(message.content)}
        </div>
        {sources && sources.length > 0 && (
          <div className="mt-3 pt-3 border-t border-accent-gold/20">
            <p className="text-xs font-semibold text-gray-700 mb-1">Sources</p>
            <ul className="text-xs text-gray-600 list-disc pl-4 space-y-1">
              {sources.slice(0, 6).map((s, i) => (
                <li key={i} className="break-words">{s}</li>
              ))}
            </ul>
          </div>
        )}
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
