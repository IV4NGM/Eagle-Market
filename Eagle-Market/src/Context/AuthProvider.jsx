import { useEffect, useState } from 'react'
import AuthContext from './AuthContext'

// eslint-disable-next-line react/prop-types
const AuthProvider = ({ children }) => {
  const [token, setToken] = useState('')
  const [loginStatus, setLoginStatus] = useState(false)
  const [userInfo, setUserInfo] = useState({})

  useEffect(() => {
    if (sessionStorage.getItem('token')) {
      setToken(sessionStorage.getItem('token'))
      setLoginStatus(sessionStorage.getItem('loginStatus'))
      setUserInfo(JSON.parse(sessionStorage.getItem('userInfo')))
    }
  }, [])
  console.log(userInfo)

  const data = { token, setToken, loginStatus, setLoginStatus, userInfo, setUserInfo }
  return (
    <AuthContext.Provider value={data}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
