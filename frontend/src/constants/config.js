// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

// App Configuration
export const APP_CONFIG = {
  name: 'Qatar 2030 Vision Chatbot',
  version: '1.0.0',
  maxMessageLength: 1000,
  chatHistoryLimit: 50,
}

// Routes
export const ROUTES = {
  HOME: '/',
  CHAT: '/chat',
}
