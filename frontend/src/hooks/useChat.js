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
      // Keep history shorter for speed (lower token load)
      const recentMessages = messages.slice(-6).map(msg => ({
        role: msg.role,
        content: msg.content
      }))
      
      const response = await chatService.sendMessage(content, recentMessages)
      const assistantMessage = {
        role: 'assistant',
        content: response.message || response.content || 'I received your message.',
        sources: response.sources,
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (err) {
      setError(err.message || 'Failed to send message')
      const errorMessage = {
        role: 'assistant',
        content: `Sorry, I encountered an error: ${err.message}. Ensure the backend is running from the backend folder (python run.py) and Ollama has the chat model (e.g. llama3.2:3b) and nomic-embed-text.`,
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
