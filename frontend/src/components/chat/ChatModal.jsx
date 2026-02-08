import { useState, useEffect, useRef } from 'react'
import { useChat } from '../../hooks/useChat'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import ChatHeader from './ChatHeader'

const ChatModal = ({ isOpen, onClose }) => {
  const { messages, sendMessage, isLoading, clearMessages } = useChat()
  const modalRef = useRef(null)

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  // Focus management
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus()
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fadeIn"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div
        ref={modalRef}
        className="fixed bottom-0 right-0 md:bottom-6 md:right-6 w-full md:w-full md:max-w-md h-[100vh] md:h-[600px] bg-white md:rounded-2xl shadow-2xl z-50 flex flex-col animate-slideUp border-t-2 md:border-2 border-accent-gold/20"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        {/* Header */}
        <ChatHeader onClose={onClose} />

        {/* Messages */}
        <div className="flex-1 overflow-hidden px-4">
          <MessageList messages={messages} isLoading={isLoading} />
        </div>

        {/* Input */}
        <div className="px-4 pb-4 pt-2">
          <MessageInput 
            onSendMessage={sendMessage} 
            disabled={isLoading}
          />
        </div>

        {/* Footer Info */}
        <div className="px-4 py-3 border-t border-gray-100 bg-gradient-to-r from-accent-gold/5 to-white rounded-b-2xl">
          <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-2">
            <svg className="w-4 h-4 text-accent-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Powered by <span className="font-semibold text-accent-gold">OpenAI</span></span>
          </p>
        </div>
      </div>
    </>
  )
}

export default ChatModal
