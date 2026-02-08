import Header from './Header'
import Footer from './Footer'
import FloatingChatButton from '../chat/FloatingChatButton'

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <FloatingChatButton />
    </div>
  )
}

export default Layout
