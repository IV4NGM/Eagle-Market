import './App.css'
import { BrowserRouter } from 'react-router-dom'
import Navbar from '@/Components/Navbar/Navbar'
import RouterIndex from '@/Routes/RouterIndex'
import Footer from '@/Components/Footer/Footer'
import AuthProvider from '@/Context/AuthContext/AuthProvider'
import ProductsProvider from '@/Context/ProductsContext/ProductsProvider'

function App () {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <ProductsProvider>
            <Navbar />
            <RouterIndex />
            <Footer />
          </ProductsProvider>
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
