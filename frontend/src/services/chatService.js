import axios from 'axios'
import { API_BASE_URL } from '../constants/config'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const chatService = {
  sendMessage: async (message, conversationHistory = []) => {
    try {
      // Prepare messages for OpenAI format
      const messages = [
        {
          role: 'system',
          content: 'You are a helpful assistant specialized in Qatar National Vision 2030. Provide accurate information about QNV 2030, the four pillars (Economic, Human, Social, Environmental Development), the three National Development Strategies (NDS1 2011-2016, NDS2 2018-2022, NDS3 2024-2030), and related topics. Base your answers on official NPC documents and strategies.'
        },
        ...conversationHistory,
        {
          role: 'user',
          content: message
        }
      ]

      const response = await apiClient.post('/api/chat', {
        messages,
        model: 'gpt-3.5-turbo', // or gpt-4
        temperature: 0.7,
        max_tokens: 1000,
      })
      
      return {
        message: response.data.choices?.[0]?.message?.content || response.data.message || 'I received your message.',
        usage: response.data.usage
      }
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || error.response.data.error?.message || 'Server error')
      } else if (error.request) {
        throw new Error('Network error. Please check your connection.')
      } else {
        throw new Error(error.message || 'An error occurred')
      }
    }
  },
}
