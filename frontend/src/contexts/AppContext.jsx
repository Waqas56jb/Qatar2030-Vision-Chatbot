import { createContext, useContext, useState } from 'react'

const AppContext = createContext()

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState('light')
  const [user, setUser] = useState(null)

  const value = {
    theme,
    setTheme,
    user,
    setUser,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
