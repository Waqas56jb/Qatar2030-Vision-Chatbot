import { useState } from 'react'
import ChatInterface from '../components/chat/ChatInterface'
import WelcomeSection from '../components/home/WelcomeSection'

const Home = () => {
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <div className="section-container py-12">
      <div className="max-w-6xl mx-auto">
        {!isChatOpen ? (
          <WelcomeSection onStartChat={() => setIsChatOpen(true)} />
        ) : (
          <ChatInterface onClose={() => setIsChatOpen(false)} />
        )}
      </div>
    </div>
  )
}

export default Home
