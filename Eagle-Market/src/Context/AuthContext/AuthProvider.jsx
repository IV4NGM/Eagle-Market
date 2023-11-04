import { useEffect, useState } from 'react'
import AuthContext from '@/Context/AuthContext/AuthContext'

// eslint-disable-next-line react/prop-types
const AuthProvider = ({ children }) => {
  const [token, setToken] = useState('')
  const [loginStatus, setLoginStatus] = useState(false)
  const [userInfo, setUserInfo] = useState({})
  const [lastLetter, setLastLetter] = useState('o')

  useEffect(() => {
    if (sessionStorage.getItem('token')) {
      setToken(sessionStorage.getItem('token'))
      setLoginStatus(sessionStorage.getItem('loginStatus'))
      setUserInfo(JSON.parse(sessionStorage.getItem('userInfo')))
      setLastLetter(sessionStorage.getItem('lastLetter'))
    }
  }, [])
  console.log(userInfo)

  const data = { token, setToken, loginStatus, setLoginStatus, userInfo, setUserInfo, lastLetter, setLastLetter }
  return (
    <AuthContext.Provider value={data}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
