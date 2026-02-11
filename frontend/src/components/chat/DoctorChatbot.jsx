import { useDoctorChat } from '../../hooks/useDoctorChat'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import DoctorChatHeader from './DoctorChatHeader'

const DoctorChatbot = () => {
  const { messages, sendMessage, isLoading, clearMessages } = useDoctorChat()

  return (
    <div className="h-screen w-screen flex flex-col bg-gradient-to-br from-white via-green-50 to-green-100 overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b-2 border-green-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <DoctorChatHeader onClear={clearMessages} />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-5xl mx-auto h-full">
          <MessageList messages={messages} isLoading={isLoading} />
        </div>
      </div>

      {/* Input */}
      <div className="flex-shrink-0 bg-white border-t-2 border-green-300 shadow-lg">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <MessageInput 
            onSendMessage={sendMessage} 
            disabled={isLoading}
            theme="green"
          />
        </div>
      </div>
    </div>
  )
}

export default DoctorChatbot
