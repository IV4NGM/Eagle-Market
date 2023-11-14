import useAuthContext from '@/Context/AuthContext/useAuthContext'
import useCartContext from '@/Context/CartContext/useCartContext'
import { useEffect, useState } from 'react'
import CustomModal from '@/Components/CustomModal/CustomModal'
import { useNavigate } from 'react-router-dom'
import NoLoggedRedirect from '@/Context/AuthContext/NoLoggedRedirect'

const Logout = () => {
  const navigate = useNavigate()
  const { setToken, setLoginStatus, setUserInfo, setLastLetter } = useAuthContext()
  const { setCart } = useCartContext()

  const [showModalSuccess, setShowModalSuccess] = useState(false)

  useEffect(() => {
    localStorage.setItem('token', '')
    localStorage.setItem('loginStatus', JSON.stringify(false))
    localStorage.setItem('userInfo', JSON.stringify({}))
    localStorage.setItem('cart', JSON.stringify([]))
    localStorage.setItem('lastLetter', 'o')
    localStorage.setItem('history', JSON.stringify([]))
    setToken('')
    setLoginStatus(false)
    setUserInfo({})
    setLastLetter('o')
    setCart([])
  }, [setCart, setLastLetter, setLoginStatus, setToken, setUserInfo])

  return (
    <div className='page-container'>
      <NoLoggedRedirect />
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
    </div>

  )
}

export default Logout
