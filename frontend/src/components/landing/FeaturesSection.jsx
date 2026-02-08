const FeaturesSection = () => {
  const features = [
    {
      icon: '🤖',
      title: 'Locally-Hosted LLM',
      description: 'Powered by lightweight LLM technology (like Ollama) running locally for fast, secure, and reliable responses without external API dependencies.',
    },
    {
      icon: '📚',
      title: 'Complete Knowledge Base',
      description: 'Trained on comprehensive Qatar 2030 Vision documents, all three NDS strategies (NDS1, NDS2, NDS3), NPC webpages, and official government publications.',
    },
    {
      icon: '🎯',
      title: 'Accurate Information',
      description: 'All answers sourced from verified official NPC documents, ensuring high accuracy and reliability for questions about Vision 2030 goals and strategies.',
    },
    {
      icon: '💬',
      title: 'Natural Language',
      description: 'Ask questions in natural language about four pillars, seven NDS3 outcomes, diversification clusters, targets, and any aspect of Qatar\'s development journey.',
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Why Choose <span className="text-accent-gold">Our Platform</span>
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Experience the future of information access with our state-of-the-art chatbot
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="card text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="text-6xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-black mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
