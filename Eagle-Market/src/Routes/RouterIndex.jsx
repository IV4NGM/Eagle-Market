import { Routes, Route } from 'react-router-dom'
import Home from '@/Pages/Home'
import Login from '@/Pages/Login'
import Logout from '@/Pages/Logout'
import Signup from '@/Pages/Signup'

const RouterIndex = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/logout' element={<Logout />} />
      <Route path='/signup' element={<Signup />} />
    </Routes>
  )
}

export default RouterIndex
