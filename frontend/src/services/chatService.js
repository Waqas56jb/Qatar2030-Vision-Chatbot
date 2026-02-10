import axios from 'axios'
import { API_BASE_URL } from '../constants/config'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 180000, // 3 min - LLM on CPU can be slow
})

export const chatService = {
  sendMessage: async (message, conversationHistory = []) => {
    try {
      // Format for Ollama RAG backend
      const messages = conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      }))

      const response = await apiClient.post('/api/chat', {
        message,
        messages,
      })
      
      return {
        message: response.data.message || 'I received your message.',
        sources: response.data.sources
      }
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.detail || error.response.data.message || 'Server error')
      } else if (error.request) {
        throw new Error('Network error. Please check your connection. Is the backend running on port 8000?')
      } else {
        throw new Error(error.message || 'An error occurred')
      }
    }
  },
}
