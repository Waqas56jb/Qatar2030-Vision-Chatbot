const StatisticsSection = () => {
  const stats = [
    {
      number: '2008',
      label: 'Vision Launched',
      description: 'Under HH Sheikh Hamad bin Khalifa Al-Thani',
      icon: '🇶🇦',
    },
    {
      number: '4%',
      label: 'Non-Hydrocarbon GDP Growth',
      description: 'NDS3 target by 2030',
      icon: '📈',
    },
    {
      number: 'Top 10',
      label: 'Digital Competitiveness',
      description: 'NDS3 target ranking',
      icon: '💻',
    },
    {
      number: '$100B+',
      label: 'FDI Attraction',
      description: 'NDS3 target investment',
      icon: '💰',
    },
    {
      number: 'Top 15',
      label: 'Logistics Performance',
      description: 'NDS3 target ranking',
      icon: '🚚',
    },
    {
      number: '85%+',
      label: 'Govt Service Satisfaction',
      description: 'NDS3 target percentage',
      icon: '✅',
    },
    {
      number: '1.5%',
      label: 'R&D Expenditure',
      description: 'Of GDP by 2030',
      icon: '🔬',
    },
    {
      number: '7',
      label: 'Strategic Outcomes',
      description: 'NDS3 key focus areas',
      icon: '🎯',
    },
  ]

  return (
    <section className="py-20 bg-black text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FCDE90' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="section-container relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Qatar 2030 <span className="text-accent-gold">By The Numbers</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Key milestones and achievements in Qatar's journey towards Vision 2030
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-8 bg-gray-900 rounded-xl border-2 border-accent-gold/20 hover:border-accent-gold transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="text-5xl mb-4">{stat.icon}</div>
              <div className="text-5xl md:text-6xl font-bold text-accent-gold mb-2">{stat.number}</div>
              <div className="text-xl font-semibold text-white mb-2">{stat.label}</div>
              <div className="text-gray-400 text-sm">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StatisticsSection
