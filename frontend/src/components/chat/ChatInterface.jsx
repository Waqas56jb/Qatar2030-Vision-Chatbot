import { useState } from 'react'
import { useChat } from '../../hooks/useChat'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import ChatHeader from './ChatHeader'

const ChatInterface = ({ onClose }) => {
  const { messages, sendMessage, isLoading } = useChat()

  const handleSendMessage = (message) => {
    sendMessage(message)
  }

  return (
    <div className="card max-w-4xl mx-auto">
      <ChatHeader onClose={onClose} />
      <div className="flex flex-col h-[600px]">
        <MessageList messages={messages} isLoading={isLoading} />
        <MessageInput onSendMessage={handleSendMessage} disabled={isLoading} />
      </div>
    </div>
  )
}

export default ChatInterface
