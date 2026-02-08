const StrategiesSection = () => {
  const strategies = [
    {
      number: '01',
      title: 'First National Development Strategy (NDS1)',
      period: '2011-2016',
      description: 'The first step in turning QNV 2030 goals into national policy and programs. Aimed to lay foundations across economy, society, human capital, environment, and institutional development. Promoted sustainable economic prosperity through diversification and innovation, integrated social development policy, advanced human development with investments in education, training, and health, and strengthened public sector institutions.',
      achievements: [
        'Sustainable economic prosperity',
        'Social protection & stability',
        'Education & training investments',
        'Institutional development',
        'Environmental safeguards'
      ],
    },
    {
      number: '02',
      title: 'Second National Development Strategy (NDS2)',
      period: '2018-2022',
      description: 'The second strategy continued driving implementation toward the Vision. Reinforced the Vision\'s long-term framework of sustained economic, human, social, and environmental progress. Emphasized institutional development, measurement of results, and lessons learned from NDS1.',
      achievements: [
        'Economic diversification',
        'Human capital development',
        'Environmental sustainability',
        'Institutional strengthening',
        'Results measurement'
      ],
    },
    {
      number: '03',
      title: 'Third National Development Strategy (NDS3)',
      period: '2024-2030',
      description: 'The current strategy aligns directly with the remaining goals of QNV 2030, focusing on sustainable growth and long-term competitiveness. Features seven strategic outcomes: Sustainable Economic Growth, Fiscal Sustainability, Future-Ready Workforce, Cohesive Society, Quality of Life, Environmental Sustainability, and Government Excellence.',
      achievements: [
        'Diversification clusters',
        'Digital competitiveness',
        'FDI attraction $100B+',
        'Future-ready workforce',
        'Government excellence'
      ],
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-accent-gold/5 to-white">
      <div className="section-container">
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-4 py-2 bg-accent-gold/20 rounded-full">
            <span className="text-black font-semibold">Implementation</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Three Development <span className="text-accent-gold">Strategies</span>
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Qatar's path to Vision 2030 is implemented through three comprehensive national development strategies
          </p>
        </div>

        <div className="space-y-12">
          {strategies.map((strategy, index) => (
            <div
              key={index}
              className="card hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-accent-gold/30"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-3">
                  <div className="text-6xl font-bold text-accent-gold/30 mb-4">{strategy.number}</div>
                  <div className="text-sm font-semibold text-accent-gold uppercase tracking-wider mb-2">
                    {strategy.period}
                  </div>
                </div>
                <div className="lg:col-span-9">
                  <h3 className="text-2xl font-bold text-black mb-4">{strategy.title}</h3>
                  <p className="text-gray-700 mb-6 leading-relaxed">{strategy.description}</p>
                  <div className="flex flex-wrap gap-3">
                    {strategy.achievements.map((achievement, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-accent-gold/20 text-black rounded-full text-sm font-medium"
                      >
                        {achievement}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StrategiesSection
