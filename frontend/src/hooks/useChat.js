import { useState, useCallback } from 'react'
import { chatService } from '../services/chatService'

export const useChat = () => {
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
      // Prepare conversation history for OpenAI (last 10 messages)
      const recentMessages = messages.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      }))
      
      const response = await chatService.sendMessage(content, recentMessages)
      const assistantMessage = {
        role: 'assistant',
        content: response.message || response.content || 'I received your message.',
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (err) {
      setError(err.message || 'Failed to send message')
      const errorMessage = {
        role: 'assistant',
        content: `Sorry, I encountered an error: ${err.message}. Please check your OpenAI API key configuration or try again.`,
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
