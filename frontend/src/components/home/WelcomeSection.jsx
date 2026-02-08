const WelcomeSection = ({ onStartChat }) => {
  return (
    <div className="text-center py-16">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-accent-gold rounded-full mb-6">
        <span className="text-black font-bold text-3xl">Q</span>
      </div>
      <h1 className="text-5xl md:text-6xl font-bold text-black mb-6">
        Welcome to <span className="text-accent-gold">Qatar 2030</span> Chatbot
      </h1>
      <p className="text-xl md:text-2xl text-gray-700 mb-10 max-w-3xl mx-auto leading-relaxed">
        Get answers about Qatar's National Vision 2030. Ask questions about development goals,
        initiatives, and progress towards a sustainable future.
      </p>
      <button 
        onClick={onStartChat} 
        className="btn-primary text-lg px-10 py-4 text-lg"
      >
        Start Chatting
      </button>
    </div>
  )
}

export default WelcomeSection
