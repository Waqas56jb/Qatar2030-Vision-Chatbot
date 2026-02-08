const AboutSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-accent-gold/10 to-white">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-accent-gold/30 to-black/20 min-h-[400px]">
              <img 
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop&auto=format&q=80" 
                alt="Qatar development" 
                className="w-full h-full object-cover absolute inset-0"
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
              {/* Fallback decorative design */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent-gold/20 via-white/10 to-black/30 flex items-center justify-center">
                <div className="text-center p-8 relative z-10">
                  <div className="text-6xl mb-4">🌆</div>
                  <p className="text-2xl font-bold text-black">Qatar Development</p>
                  <p className="text-gray-700 mt-2">Building the Future</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="inline-block mb-4 px-4 py-2 bg-accent-gold/20 rounded-full">
              <span className="text-black font-semibold">About Qatar 2030</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
              Qatar National <span className="text-accent-gold">Vision 2030</span>
            </h2>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              Qatar National Vision 2030 (QNV 2030) is a long-term national roadmap launched in 2008 under His Highness Sheikh Hamad bin Khalifa Al-Thani, the Father Emir of Qatar. It serves as a strategic framework to guide and balance economic growth with social well-being, human capital development, and environmental preservation.
            </p>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              The Vision aims to transform Qatar into a prosperous, diversified, knowledge-based, sustainable, and inclusive society by 2030. It guides policy direction for government, private sector, citizens, and residents. The Vision is built on four interconnected pillars: Economic Development, Human Development, Social Development, and Environmental Development.
            </p>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Implementation is carried out through three sequential National Development Strategies: NDS1 (2011-2016) laid foundations, NDS2 (2018-2022) continued building, and NDS3 (2024-2030) focuses on seven strategic outcomes including sustainable economic growth, fiscal sustainability, future-ready workforce, cohesive society, quality of life, environmental sustainability, and government excellence.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="text-center p-6 bg-white rounded-xl shadow-lg border-2 border-accent-gold/20 hover:border-accent-gold transition-colors">
                <div className="text-4xl font-bold text-accent-gold mb-2">4</div>
                <div className="text-sm font-semibold text-gray-700">Core Pillars</div>
                <div className="text-xs text-gray-500 mt-1">Foundation of Vision</div>
              </div>
              <div className="text-center p-6 bg-white rounded-xl shadow-lg border-2 border-accent-gold/20 hover:border-accent-gold transition-colors">
                <div className="text-4xl font-bold text-accent-gold mb-2">3</div>
                <div className="text-sm font-semibold text-gray-700">Strategies</div>
                <div className="text-xs text-gray-500 mt-1">Implementation Phases</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
