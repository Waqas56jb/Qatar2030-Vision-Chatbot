import React from 'react'
import { API_BASE_URL } from '../../constants/config'
import DoctorDetailModal from './DoctorDetailModal'

// Simple formatting: line breaks, **bold**, numbered lists
const formatMessage = (text) => {
  if (!text) return ''
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => 
    part.startsWith('**') && part.endsWith('**') 
      ? <strong key={i}>{part.slice(2, -2)}</strong> 
      : part
  )
}

const DoctorPhoto = ({ doctor, isGreen }) => {
  const [imageError, setImageError] = React.useState(false)
  const [currentPhotoIndex, setCurrentPhotoIndex] = React.useState(0)
  const [photoUrls, setPhotoUrls] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  
  // Fetch photo URLs from backend when component mounts
  React.useEffect(() => {
    const fetchPhotoUrls = async () => {
      if (!doctor.name) {
        setLoading(false)
        return
      }
      
      try {
        const response = await fetch(`${API_BASE_URL}/api/doctor-photo/${encodeURIComponent(doctor.name)}`)
        if (response.ok) {
          const data = await response.json()
          const urls = data.photo_urls || []
          if (data.primary_url) {
            setPhotoUrls([data.primary_url, ...urls.filter(u => u !== data.primary_url)])
          } else {
            setPhotoUrls(urls)
          }
        }
      } catch (error) {
        console.error('Error fetching photo URLs:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchPhotoUrls()
  }, [doctor.name])
  
  // Generate fallback URLs if backend fetch fails
  const getFallbackUrls = (doctorUrl) => {
    if (!doctorUrl || !doctorUrl.includes('sidra.org/doctors/')) return []
    
    try {
      const parts = doctorUrl.replace(/\/$/, '').split('/')
      const slug = parts[parts.length - 1] || parts[parts.length - 2]
      if (!slug) return []
      
      const now = new Date()
      const currentYear = now.getFullYear()
      const currentMonth = now.getMonth() + 1
      const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1
      const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear
      
      const commonHashes = ['67cee20a', '44ac983b', 'b131058f']
      const commonIds = ['01', '02', '2025-01', '2024-11']
      
      const urls = []
      for (const hash of commonHashes) {
        for (const id of commonIds) {
          urls.push(`https://storage.googleapis.com/sid-website-content/${currentYear}/${String(currentMonth).padStart(2, '0')}/${hash}-${slug}-${id}-300x300.jpg`)
          urls.push(`https://storage.googleapis.com/sid-website-content/${prevYear}/${String(prevMonth).padStart(2, '0')}/${hash}-${slug}-${id}-300x300.jpg`)
        }
      }
      
      urls.push(
        `https://www.sidra.org/wp-content/uploads/doctors/${slug}-300x300.jpg`,
        `https://www.sidra.org/wp-content/uploads/doctors/${slug}.jpg`,
        `https://www.sidra.org/wp-content/uploads/doctors/${slug}.png`,
      )
      
      return urls
    } catch {
      return []
    }
  }
  
  // Combine backend URLs with fallback URLs
  const allPhotoUrls = React.useMemo(() => {
    const backendUrls = photoUrls.length > 0 ? photoUrls : []
    const fallbackUrls = getFallbackUrls(doctor.url)
    return [...backendUrls, ...fallbackUrls.filter(u => !backendUrls.includes(u))]
  }, [photoUrls, doctor.url])
  
  const currentPhotoUrl = allPhotoUrls[currentPhotoIndex]
  
  // Show loading state
  if (loading) {
    return (
      <div className={`flex-shrink-0 w-20 h-20 rounded-full ${
        isGreen ? 'bg-green-100' : 'bg-accent-gold/20'
      } flex items-center justify-center border-2 border-gray-200 animate-pulse`}>
        <div className={`w-8 h-8 border-2 ${
          isGreen ? 'border-green-600' : 'border-accent-gold'
        } border-t-transparent rounded-full animate-spin`}></div>
      </div>
    )
  }
  
  // Try to load image from URLs
  if (currentPhotoUrl && !imageError && currentPhotoIndex < allPhotoUrls.length) {
    return (
      <div className="flex-shrink-0 w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200">
        <img 
          src={currentPhotoUrl} 
          alt={doctor.name || 'Doctor'}
          className="w-full h-full object-cover"
          onError={() => {
            if (currentPhotoIndex < allPhotoUrls.length - 1) {
              setCurrentPhotoIndex(currentPhotoIndex + 1)
            } else {
              setImageError(true)
            }
          }}
          onLoad={() => {
            // Successfully loaded image
            setImageError(false)
          }}
        />
      </div>
    )
  }
  
  // Fallback to initials
  return (
    <div className={`flex-shrink-0 w-20 h-20 rounded-full ${
      isGreen ? 'bg-green-100' : 'bg-accent-gold/20'
    } flex items-center justify-center border-2 border-gray-200`}>
      <span className={`text-2xl font-bold ${
        isGreen ? 'text-green-600' : 'text-accent-gold'
      }`}>
        {doctor.name ? doctor.name.charAt(0).toUpperCase() : 'D'}
      </span>
    </div>
  )
}

const MessageItem = ({ message, theme = 'gold' }) => {
  const isUser = message.role === 'user'
  const sources = !isUser && Array.isArray(message.sources) ? message.sources : null
  const doctors = !isUser && Array.isArray(message.doctors) ? message.doctors : null
  const isGreen = theme === 'green'
  const [selectedDoctor, setSelectedDoctor] = React.useState(null)
  const [isModalOpen, setIsModalOpen] = React.useState(false)

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[85%] rounded-xl px-5 py-4 shadow-md ${
          isUser
            ? isGreen ? 'bg-green-500 text-white' : 'bg-accent-gold text-black'
            : isGreen 
              ? 'bg-gray-100 text-black border-2 border-green-300'
              : 'bg-gray-100 text-black border-2 border-accent-gold/30'
        }`}
      >
        <div 
          className="text-sm leading-relaxed whitespace-pre-wrap break-words"
          style={{ lineHeight: '1.7' }}
        >
          {formatMessage(message.content)}
        </div>
        
        {/* Doctor profiles (for doctor chatbot) */}
        {doctors && doctors.length > 0 && (
          <div className={`mt-4 pt-4 border-t ${isGreen ? 'border-green-300/30' : 'border-accent-gold/20'}`}>
            <p className={`text-sm font-bold mb-3 ${isGreen ? 'text-green-700' : 'text-gray-800'}`}>
              Recommended Doctors:
            </p>
            <div className="space-y-4">
              {doctors.map((doctor, i) => (
                <div 
                  key={i} 
                  onClick={() => {
                    setSelectedDoctor(doctor)
                    setIsModalOpen(true)
                  }}
                  className={`bg-white rounded-lg p-4 shadow-sm border-2 cursor-pointer transition-all hover:shadow-md hover:scale-[1.02] ${
                    isGreen ? 'border-green-200 hover:border-green-300' : 'border-accent-gold/30 hover:border-accent-gold/50'
                  }`}
                >
                  <div className="flex gap-4">
                    {/* Doctor Photo */}
                    <DoctorPhoto doctor={doctor} isGreen={isGreen} />
                    
                    {/* Doctor Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-gray-900 mb-1">
                        {doctor.name || 'Unknown Doctor'}
                      </h3>
                      
                      {doctor.title && (
                        <p className="text-sm text-gray-700 font-medium mb-1">
                          {doctor.title}
                        </p>
                      )}
                      
                      {doctor.department && (
                        <p className="text-sm text-gray-600 mb-2">
                          {doctor.department}
                        </p>
                      )}
                      
                      <div className="flex flex-wrap gap-3 mb-2">
                        {doctor.experience_years > 0 && (
                          <span className={`text-xs font-semibold px-2 py-1 rounded ${
                            isGreen 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-accent-gold/20 text-gray-700'
                          }`}>
                            {doctor.experience_years} years experience
                          </span>
                        )}
                      </div>
                      
                      {doctor.qualifications && doctor.qualifications.length > 0 && (
                        <p className="text-xs text-gray-600 mb-2">
                          <span className="font-semibold">Qualifications:</span>{' '}
                          {doctor.qualifications.slice(0, 5).join(', ')}
                          {doctor.qualifications.length > 5 && ' ...'}
                        </p>
                      )}
                      
                      {doctor.specialties && doctor.specialties.length > 0 && (
                        <p className="text-xs text-gray-600 mb-2">
                          <span className="font-semibold">Specialties:</span>{' '}
                          {doctor.specialties.slice(0, 5).join(', ')}
                          {doctor.specialties.length > 5 && ' ...'}
                        </p>
                      )}
                      
                      {doctor.bio && (
                        <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                          {doctor.bio}
                        </p>
                      )}
                      
                      {/* Source Link - URL from RAG (original dataset) */}
                      {doctor.url ? (
                        <div className="mt-3 pt-2 border-t border-gray-200">
                          <a
                            href={doctor.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-xs font-medium hover:underline inline-flex items-center gap-1 ${
                              isGreen ? 'text-green-600 hover:text-green-700' : 'text-accent-gold hover:text-accent-gold/80'
                            }`}
                            onClick={(e) => e.stopPropagation()} // Prevent card click when clicking link
                            title={`View ${doctor.name}'s profile on Sidra Medicine: ${doctor.url}`}
                          >
                            View Profile on Sidra Medicine
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                          <p className="text-xs text-gray-500 mt-1">Source: RAG Database</p>
                        </div>
                      ) : (
                        <div className="mt-3 pt-2 border-t border-gray-200">
                          <p className="text-xs text-gray-400 italic">Profile URL not available</p>
                        </div>
                      )}
                      
                      {/* Click indicator */}
                      <p className={`text-xs mt-2 font-medium ${
                        isGreen ? 'text-green-600' : 'text-accent-gold'
                      }`}>
                        Click card to view full profile →
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Sources (for Qatar 2030 chatbot) */}
        {sources && sources.length > 0 && !doctors && (
          <div className={`mt-3 pt-3 border-t ${isGreen ? 'border-green-300/30' : 'border-accent-gold/20'}`}>
            <p className="text-xs font-semibold text-gray-700 mb-1">Sources</p>
            <ul className="text-xs text-gray-600 list-disc pl-4 space-y-1">
              {sources.slice(0, 6).map((s, i) => (
                <li key={i} className="break-words">{s}</li>
              ))}
            </ul>
          </div>
        )}
        
        {message.timestamp && (
          <p className={`text-xs mt-2 ${isUser ? isGreen ? 'text-white/80' : 'text-black/60' : 'text-gray-500'}`}>
            {new Date(message.timestamp).toLocaleTimeString()}
          </p>
        )}
      </div>

      {/* Doctor Detail Modal */}
      {selectedDoctor && (
        <DoctorDetailModal
          doctor={selectedDoctor}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedDoctor(null)
          }}
          theme={theme}
        />
      )}
    </div>
  )
}

export default MessageItem
