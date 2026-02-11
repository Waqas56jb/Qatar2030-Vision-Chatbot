import { useState, useCallback } from 'react'
import axios from 'axios'
import { API_BASE_URL } from '../constants/config'

const doctorApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 300000, // 300 seconds (5 minutes) for doctor RAG - LLM can be very slow on CPU
})

export const useDoctorChat = () => {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const sendMessage = useCallback(async (content) => {
    const userMessage = {
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)
    setError(null)

    try {
      // Prepare conversation history (last 3 messages for speed)
      const recentMessages = messages.slice(-3).map(msg => ({
        role: msg.role,
        content: msg.content
      }))

      const response = await doctorApiClient.post('/api/doctor-chat', {
        message: content,
        messages: recentMessages,
      })
      
      const assistantMessage = {
        role: 'assistant',
        content: response.data.message || 'I received your message.',
        sources: response.data.sources,
        doctors: response.data.doctors, // Full doctor info for display
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (err) {
      setError(err.message || 'Failed to get doctor recommendations')
      const errorMessage = {
        role: 'assistant',
        content: `Sorry, I encountered an error: ${err.message}. Ensure the backend is running (python run.py) and doctor index is built (python build_doctor_index.py).`,
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }, [messages])

  const clearMessages = useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  }
}
