const VisionPillarsSection = () => {
  const pillars = [
    {
      icon: '💼',
      title: 'Economic Development',
      description: 'Building a diversified, competitive, and sustainable economy with sound economic management, balanced oil & gas exploitation, private sector growth, innovation, entrepreneurship, and a knowledge-based economy with world-class infrastructure.',
      keyPoints: [
        'Diversified & competitive economy',
        'Knowledge-based economy',
        'Private sector growth',
        'Global economic participation'
      ],
      color: 'from-purple-500/20 to-purple-600/20',
    },
    {
      icon: '👥',
      title: 'Human Development',
      description: 'Prioritizing investment in people\'s education, health, and workforce capabilities. Building world-class education systems, expanding lifelong learning, establishing high-quality healthcare, and increasing national workforce participation.',
      keyPoints: [
        'World-class education systems',
        'Lifelong learning & research',
        'High-quality healthcare',
        'Workforce participation'
      ],
      color: 'from-blue-500/20 to-blue-600/20',
    },
    {
      icon: '🏛️',
      title: 'Social Development',
      description: 'Strengthening social cohesion, cultural identity, and societal well-being. Promoting equality, justice, civil rights, cultural expression, national heritage preservation, and enhancing women\'s roles in economic and political participation.',
      keyPoints: [
        'Social protection systems',
        'Equality & justice',
        'Cultural heritage',
        'Women empowerment'
      ],
      color: 'from-green-500/20 to-green-600/20',
    },
    {
      icon: '🌱',
      title: 'Environmental Development',
      description: 'Ensuring balance between growth and environmental sustainability. Protecting natural resources, building environmental awareness, implementing sustainable urban planning, pollution mitigation, and supporting regional cooperation on climate change.',
      keyPoints: [
        'Natural resource protection',
        'Sustainable urban planning',
        'Pollution mitigation',
        'Climate cooperation'
      ],
      color: 'from-emerald-500/20 to-emerald-600/20',
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="section-container">
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-4 py-2 bg-accent-gold/20 rounded-full">
            <span className="text-black font-semibold">Foundation</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Four Pillars of <span className="text-accent-gold">Vision 2030</span>
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Qatar National Vision 2030 is built on four interconnected pillars that guide the nation's development journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((pillar, index) => (
            <div
              key={index}
              className="card hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-accent-gold/30"
            >
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${pillar.color} flex items-center justify-center mb-6 text-4xl`}>
                {pillar.icon}
              </div>
              <h3 className="text-xl font-bold text-black mb-3">{pillar.title}</h3>
              <p className="text-gray-600 leading-relaxed mb-4">{pillar.description}</p>
              <div className="space-y-2">
                {pillar.keyPoints.map((point, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                    <div className="w-1.5 h-1.5 bg-accent-gold rounded-full"></div>
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default VisionPillarsSection
