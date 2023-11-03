import useAuthContext from '@/Context/AuthContext/useAuthContext'
import useCartContext from '@/Context/CartContext/useCartContext'
import { useEffect } from 'react'

const Logout = () => {
  const { setToken, setLoginStatus, setUserInfo } = useAuthContext()
  const { setCart } = useCartContext()
  // setToken('')
  // setLoginStatus(false)
  // setUserInfo({})
  useEffect(() => {
    sessionStorage.setItem('token', '')
    sessionStorage.setItem('loginStatus', JSON.stringify(false))
    sessionStorage.setItem('userInfo', JSON.stringify({}))
    sessionStorage.setItem('cart', JSON.stringify([]))
    setToken('')
    setLoginStatus(false)
    setUserInfo({})
    setCart([])
  }, [setCart, setLoginStatus, setToken, setUserInfo])

  return (
    <div>Has cerrado sesión exitosamente</div>
  )
}

export default Logout
