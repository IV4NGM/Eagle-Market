import { Routes, Route } from 'react-router-dom'
import Home from '@/Pages/Home'
import Login from '@/Pages/Login'
import Logout from '@/Pages/Logout'
import Signup from '@/Pages/Signup'
import ProductDetail from '@/Pages/ProductDetail'
import Checkout from '@/Pages/Checkout'
import NewProduct from '@/Pages/NewProduct'
import MyOrders from '@/Pages/MyOrders'
import OrderDetail from '@/Pages/OrderDetail'
import PageNotFound from '@/Pages/PageNotFound'
import Search from '@/Pages/Search'

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
      <Route path='/my-orders/:id' element={<OrderDetail />} />
      <Route path='/search' element={<Search />} />
      <Route path='/search/:text' element={<Search />} />
      <Route path='/*' element={<PageNotFound />} />
    </Routes>
  )
}

export default RouterIndex
