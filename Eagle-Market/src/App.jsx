import './App.css'
import { BrowserRouter } from 'react-router-dom'
import Navbar from '@/Components/Navbar/Navbar'
import RouterIndex from '@/Routes/RouterIndex'
import Footer from '@/Components/Footer/Footer'
import AuthProvider from '@/Context/AuthProvider'

function App () {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Navbar />
          <RouterIndex />
          <Footer />
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
