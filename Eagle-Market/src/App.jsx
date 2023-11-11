import './App.css'
import { BrowserRouter } from 'react-router-dom'
import Navbar from '@/Components/Navbar/Navbar'
import RouterIndex from '@/Routes/RouterIndex'
import Footer from '@/Components/Footer/Footer'
import AuthProvider from '@/Context/AuthContext/AuthProvider'
import ProductsProvider from '@/Context/ProductsContext/ProductsProvider'
import CartProvider from '@/Context/CartContext/CartProvider'
import Loader from '@/Components/Loader/Loader'
import ScrollButton from '@/Components/ScrollButton/ScrollButton'

function App () {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <ProductsProvider>
            <CartProvider>
              <Loader />
              <Navbar />
              <RouterIndex />
              <ScrollButton />
              <Footer />
            </CartProvider>
          </ProductsProvider>
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
