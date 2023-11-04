import useAuthContext from '@/Context/AuthContext/useAuthContext'
import useCartContext from '@/Context/CartContext/useCartContext'
import { useEffect, useState } from 'react'
import CustomModal from '@/Components/CustomModal/CustomModal'
import { useNavigate } from 'react-router-dom'

const Logout = () => {
  const navigate = useNavigate()
  const { setToken, setLoginStatus, setUserInfo, setLastLetter } = useAuthContext()
  const { setCart } = useCartContext()

  const [showModalSuccess, setShowModalSuccess] = useState(true)
  // setToken('')
  // setLoginStatus(false)
  // setUserInfo({})
  useEffect(() => {
    sessionStorage.setItem('token', '')
    sessionStorage.setItem('loginStatus', JSON.stringify(false))
    sessionStorage.setItem('userInfo', JSON.stringify({}))
    sessionStorage.setItem('cart', JSON.stringify([]))
    sessionStorage.setItem('lastLetter', 'o')
    setToken('')
    setLoginStatus(false)
    setUserInfo({})
    setLastLetter('o')
    setCart([])
  }, [setCart, setLastLetter, setLoginStatus, setToken, setUserInfo])

  return (
    <CustomModal
      title='Sesión cerrada exitosamente'
      showModal={showModalSuccess}
      setShowModal={setShowModalSuccess}
      text='Has cerrado sesión correctamente. ¡Vamos a inicio para empezar a comprar!'
      onNo={() => {
        navigate('/')
      }}
      onYes={() => {
        navigate('/login')
      }}
      textNo='Ir a Inicio'
      textYes='Iniciar sesión con otra cuenta'
    />
  )
}

export default Logout
