import { Routes, Route } from 'react-router-dom'
import Home from '@/Pages/Home'
import Login from '@/Pages/Login'
import Logout from '@/Pages/Logout'
import Signup from '@/Pages/Signup'
import ProductDetail from '@/Pages/ProductDetail'
import Checkout from '@/Pages/Checkout'
import NewProduct from '@/Pages/NewProduct'
import MyOrders from '@/Pages/MyOrders'

const RouterIndex = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/logout' element={<Logout />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/product/:id' element={<ProductDetail />} />
      <Route path='/checkout' element={<Checkout />} />
      <Route path='/new-product' element={<NewProduct />} />
      <Route path='/my-orders' element={<MyOrders />} />
    </Routes>
  )
}

export default RouterIndex
