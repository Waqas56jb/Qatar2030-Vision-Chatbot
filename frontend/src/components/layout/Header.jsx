import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

const Header = () => {
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const isActive = (path) => location.pathname === path

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50 border-b-2 border-accent-gold">
      <div className="section-container">
        <nav className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-accent-gold rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-xl">Q</span>
            </div>
            <span className="text-2xl font-bold text-black">
              Qatar <span className="text-accent-gold">2030</span>
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              to="/" 
              className={`font-semibold transition-colors ${
                isActive('/') ? 'text-accent-gold' : 'text-black hover:text-accent-gold'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/login" 
              className={`font-semibold transition-colors ${
                isActive('/login') ? 'text-accent-gold' : 'text-black hover:text-accent-gold'
              }`}
            >
              Login
            </Link>
            <Link 
              to="/signup" 
              className="btn-primary"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-black"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-3">
            <Link 
              to="/" 
              className={`block font-semibold transition-colors ${
                isActive('/') ? 'text-accent-gold' : 'text-black hover:text-accent-gold'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/login" 
              className={`block font-semibold transition-colors ${
                isActive('/login') ? 'text-accent-gold' : 'text-black hover:text-accent-gold'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
            <Link 
              to="/signup" 
              className="btn-primary inline-block"
              onClick={() => setIsMenuOpen(false)}
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
