import useAuthContext from '@/Context/AuthContext/useAuthContext'
import { useEffect } from 'react'

const Logout = () => {
  const { setToken, setLoginStatus, setUserInfo } = useAuthContext()
  // setToken('')
  // setLoginStatus(false)
  // setUserInfo({})
  useEffect(() => {
    sessionStorage.setItem('token', '')
    sessionStorage.setItem('loginStatus', JSON.stringify(false))
    sessionStorage.setItem('userInfo', JSON.stringify({}))
    setToken('')
    setLoginStatus(false)
    setUserInfo({})
  }, [setLoginStatus, setToken, setUserInfo])

  return (
    <div>Has cerrado sesión exitosamente</div>
  )
}

export default Logout
