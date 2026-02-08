import { useState } from 'react'
import ChatModal from './ChatModal'

const FloatingChatButton = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Floating Button - Hidden when modal is open */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-accent-gold rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center z-40 group border-2 border-black/10"
          aria-label="Open chatbot"
        >
        <svg 
          className="w-8 h-8 text-black group-hover:rotate-12 transition-transform" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
          />
        </svg>
        
        {/* Pulse Animation */}
        <span className="absolute inset-0 bg-accent-gold rounded-full animate-ping opacity-20"></span>
        
          {/* Notification Badge */}
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-black rounded-full flex items-center justify-center border-2 border-white">
            <span className="w-2 h-2 bg-accent-gold rounded-full"></span>
          </span>
        </button>
      )}

      {/* Chat Modal */}
      {isOpen && <ChatModal isOpen={isOpen} onClose={() => setIsOpen(false)} />}
    </>
  )
}

export default FloatingChatButton
