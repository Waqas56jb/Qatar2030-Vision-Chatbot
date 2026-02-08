import { Link } from 'react-router-dom'

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-white via-accent-gold/10 to-accent-gold/20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="section-container relative z-10 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-block mb-4 px-4 py-2 bg-accent-gold/20 rounded-full">
              <span className="text-black font-semibold">Qatar National Vision 2030</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-black mb-6 leading-tight">
              Discover Qatar's
              <span className="block text-accent-gold">Vision 2030</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed">
              Your intelligent chatbot assistant powered by locally-hosted LLM technology. 
              Get instant, accurate answers about Qatar's four development pillars, three National Development Strategies (NDS1, NDS2, NDS3), and comprehensive Vision 2030 goals from official NPC documents.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/login" className="btn-primary text-lg px-8 py-4">
                Get Started
              </Link>
              <Link to="/signup" className="btn-outline text-lg px-8 py-4">
                Learn More
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-accent-gold/30 to-black/20 min-h-[400px] flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600&fit=crop&auto=format&q=80" 
                alt="Qatar modern architecture" 
                className="w-full h-full object-cover absolute inset-0"
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
              {/* Fallback decorative design */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent-gold/20 via-white/10 to-black/30 flex items-center justify-center">
                <div className="text-center p-8 relative z-10">
                  <div className="w-32 h-32 mx-auto mb-6 bg-accent-gold/30 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <div className="w-24 h-24 bg-accent-gold rounded-full flex items-center justify-center">
                      <span className="text-black font-bold text-5xl">Q</span>
                    </div>
                  </div>
                  <div className="text-black font-bold text-3xl mb-2">Qatar 2030</div>
                  <div className="text-gray-700 text-lg">Vision for the Future</div>
                </div>
              </div>
            </div>
            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent-gold rounded-full opacity-20 blur-2xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent-gold rounded-full opacity-20 blur-2xl"></div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}

export default HeroSection
