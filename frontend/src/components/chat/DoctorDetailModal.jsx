import React from 'react'
import axios from 'axios'
import { API_BASE_URL } from '../../constants/config'

const DoctorPhotoLarge = ({ doctor, isGreen }) => {
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
        const { API_BASE_URL } = await import('../../constants/config')
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
  
  // Generate fallback URLs
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
  
  const allPhotoUrls = React.useMemo(() => {
    const backendUrls = photoUrls.length > 0 ? photoUrls : []
    const fallbackUrls = getFallbackUrls(doctor.url)
    return [...backendUrls, ...fallbackUrls.filter(u => !backendUrls.includes(u))]
  }, [photoUrls, doctor.url])
  
  const currentPhotoUrl = allPhotoUrls[currentPhotoIndex]
  
  if (loading) {
    return (
      <div className={`w-32 h-32 rounded-full ${
        isGreen ? 'bg-green-100' : 'bg-accent-gold/20'
      } flex items-center justify-center border-4 border-gray-200 animate-pulse`}>
        <div className={`w-8 h-8 border-2 ${
          isGreen ? 'border-green-600' : 'border-accent-gold'
        } border-t-transparent rounded-full animate-spin`}></div>
      </div>
    )
  }
  
  if (currentPhotoUrl && !imageError && currentPhotoIndex < allPhotoUrls.length) {
    return (
      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200">
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
          onLoad={() => setImageError(false)}
        />
      </div>
    )
  }
  
  // Fallback to initials
  return (
    <div className={`w-32 h-32 rounded-full ${
      isGreen ? 'bg-green-100' : 'bg-accent-gold/20'
    } flex items-center justify-center border-4 border-gray-200`}>
      <span className={`text-4xl font-bold ${
        isGreen ? 'text-green-600' : 'text-accent-gold'
      }`}>
        {doctor.name ? doctor.name.charAt(0).toUpperCase() : 'D'}
      </span>
    </div>
  )
}

const DoctorDetailModal = ({ doctor, isOpen, onClose, theme = 'green' }) => {
  const [fullDetails, setFullDetails] = React.useState(null)
  const [loading, setLoading] = React.useState(false)
  const isGreen = theme === 'green'

  React.useEffect(() => {
    if (isOpen && doctor) {
      setLoading(true)
      // Fetch full doctor details from backend
      axios.get(`${API_BASE_URL}/api/doctor-details/${encodeURIComponent(doctor.name)}`)
        .then(response => {
          setFullDetails(response.data)
          setLoading(false)
        })
        .catch(error => {
          console.error('Error fetching doctor details:', error)
          // Fallback to existing doctor data if API fails
          setFullDetails(doctor)
          setLoading(false)
        })
    }
  }, [isOpen, doctor])

  if (!isOpen || !doctor) return null

  const displayDoctor = fullDetails || doctor

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className={`bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto ${
        isGreen ? 'border-2 border-green-300' : 'border-2 border-accent-gold'
      }`}>
        {/* Header */}
        <div className={`sticky top-0 z-10 flex items-center justify-between p-6 border-b-2 ${
          isGreen ? 'bg-green-50 border-green-200' : 'bg-accent-gold/10 border-accent-gold/30'
        }`}>
          <h2 className="text-2xl font-bold text-gray-900">
            {displayDoctor.name || 'Doctor Profile'}
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-full hover:bg-gray-200 transition-colors ${
              isGreen ? 'text-green-700' : 'text-gray-700'
            }`}
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className={`animate-spin rounded-full h-12 w-12 border-4 ${
                isGreen ? 'border-green-500' : 'border-accent-gold'
              } border-t-transparent`}></div>
            </div>
          ) : (
            <>
              {/* Doctor Photo and Basic Info */}
              <div className="flex gap-6 mb-6">
                <div className="flex-shrink-0">
                  <DoctorPhotoLarge doctor={displayDoctor} isGreen={isGreen} />
                </div>

                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {displayDoctor.name || 'Unknown Doctor'}
                  </h3>
                  
                  {displayDoctor.title && (
                    <p className="text-lg text-gray-700 font-semibold mb-2">
                      {displayDoctor.title}
                    </p>
                  )}
                  
                  {displayDoctor.department && (
                    <p className="text-base text-gray-600 mb-3">
                      {displayDoctor.department}
                    </p>
                  )}
                  
                  {displayDoctor.experience_years > 0 && (
                    <span className={`inline-block text-sm font-semibold px-3 py-1 rounded-full ${
                      isGreen 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-accent-gold/20 text-gray-700'
                    }`}>
                      {displayDoctor.experience_years} years of experience
                    </span>
                  )}
                </div>
              </div>

              {/* Qualifications */}
              {displayDoctor.qualifications && displayDoctor.qualifications.length > 0 && (
                <div className="mb-6">
                  <h4 className={`text-lg font-bold mb-2 ${
                    isGreen ? 'text-green-700' : 'text-gray-800'
                  }`}>
                    Qualifications
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {displayDoctor.qualifications.map((qual, idx) => (
                      <span 
                        key={idx}
                        className={`px-3 py-1 rounded-full text-sm ${
                          isGreen 
                            ? 'bg-green-50 text-green-800 border border-green-200' 
                            : 'bg-accent-gold/10 text-gray-700 border border-accent-gold/30'
                        }`}
                      >
                        {qual}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Specialties */}
              {displayDoctor.specialties && displayDoctor.specialties.length > 0 && (
                <div className="mb-6">
                  <h4 className={`text-lg font-bold mb-2 ${
                    isGreen ? 'text-green-700' : 'text-gray-800'
                  }`}>
                    Specialties & Clinical Interests
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {displayDoctor.specialties.map((specialty, idx) => (
                      <li key={idx} className="text-sm">{specialty}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Full Bio */}
              {(displayDoctor.full_bio || displayDoctor.full_text || displayDoctor.bio) && (
                <div className="mb-6">
                  <h4 className={`text-lg font-bold mb-3 ${
                    isGreen ? 'text-green-700' : 'text-gray-800'
                  }`}>
                    Professional Background
                  </h4>
                  <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                    {displayDoctor.full_bio || displayDoctor.full_text || displayDoctor.bio}
                  </div>
                </div>
              )}

              {/* Source Link */}
              {displayDoctor.url && (
                <div className={`mt-6 pt-6 border-t-2 ${
                  isGreen ? 'border-green-200' : 'border-accent-gold/30'
                }`}>
                  <a
                    href={displayDoctor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 text-sm font-semibold hover:underline ${
                      isGreen ? 'text-green-600 hover:text-green-700' : 'text-accent-gold hover:text-accent-gold/80'
                    }`}
                  >
                    View Full Profile on Sidra Medicine Website
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              )}

              {/* Contact Info */}
              <div className={`mt-4 pt-4 border-t-2 ${
                isGreen ? 'border-green-200' : 'border-accent-gold/30'
              }`}>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">For appointments:</span> Please contact Sidra Medicine at{' '}
                  <a href="tel:40033333" className={`font-semibold ${
                    isGreen ? 'text-green-600 hover:text-green-700' : 'text-accent-gold hover:text-accent-gold/80'
                  }`}>
                    4003 3333
                  </a>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default DoctorDetailModal
