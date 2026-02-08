import { Link } from 'react-router-dom'

const CTASection = () => {
  return (
    <section className="py-20 bg-black text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FCDE90' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="section-container relative z-10 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Ready to Explore <span className="text-accent-gold">Qatar 2030 Vision</span>?
        </h2>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Start exploring Qatar National Vision 2030 with our intelligent chatbot. Get instant answers about the four pillars, three NDS strategies, and comprehensive development goals from official NPC documents.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/signup" className="btn-primary text-lg px-8 py-4 bg-accent-gold text-black hover:bg-primary-600">
            Create Account
          </Link>
          <Link to="/login" className="btn-outline text-lg px-8 py-4 border-2 border-accent-gold text-white hover:bg-accent-gold hover:text-black">
            Sign In
          </Link>
        </div>
      </div>
    </section>
  )
}

export default CTASection
