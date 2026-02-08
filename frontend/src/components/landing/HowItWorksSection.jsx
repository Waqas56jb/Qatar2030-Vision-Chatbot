const HowItWorksSection = () => {
  const steps = [
    {
      step: '01',
      title: 'Ask Your Question',
      description: 'Simply type your question about Qatar 2030 Vision in natural language. Our AI understands context and intent.',
      icon: '💬',
    },
    {
      step: '02',
      title: 'AI Processing',
      description: 'Our locally-hosted LLM processes your query against the comprehensive knowledge base of Qatar 2030 documents.',
      icon: '🤖',
    },
    {
      step: '03',
      title: 'Get Instant Answers',
      description: 'Receive accurate, detailed answers sourced from official Qatar National Vision 2030 documents and strategies.',
      icon: '⚡',
    },
    {
      step: '04',
      title: 'Explore Further',
      description: 'Continue the conversation, ask follow-up questions, and dive deeper into any topic that interests you.',
      icon: '🔍',
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="section-container">
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-4 py-2 bg-accent-gold/20 rounded-full">
            <span className="text-black font-semibold">How It Works</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Simple, Fast, <span className="text-accent-gold">Intelligent</span>
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Get answers about Qatar 2030 Vision in just a few simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative"
            >
              <div className="card text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-accent-gold rounded-full flex items-center justify-center text-black font-bold text-lg shadow-lg">
                  {step.step}
                </div>
                <div className="text-6xl mb-6 mt-4">{step.icon}</div>
                <h3 className="text-xl font-bold text-black mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-accent-gold/30 transform -translate-y-1/2">
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-8 border-l-accent-gold/30 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorksSection
