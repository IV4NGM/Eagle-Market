import { useEffect, useState } from 'react'
import AuthContext from '@/Context/AuthContext/AuthContext'

// eslint-disable-next-line react/prop-types
const AuthProvider = ({ children }) => {
  const [token, setToken] = useState('')
  const [loginStatus, setLoginStatus] = useState(false)
  const [userInfo, setUserInfo] = useState({})
  const [lastLetter, setLastLetter] = useState('o')
  const [history, setHistory] = useState([])

  useEffect(() => {
    if (localStorage.getItem('token')) {
      setToken(localStorage.getItem('token'))
      setLoginStatus(localStorage.getItem('loginStatus'))
      setUserInfo(JSON.parse(localStorage.getItem('userInfo')))
      setLastLetter(localStorage.getItem('lastLetter'))
      setHistory(JSON.parse(localStorage.getItem('history')))
    } else {
      localStorage.setItem('token', '')
      localStorage.setItem('loginStatus', JSON.stringify(false))
      localStorage.setItem('userInfo', JSON.stringify({}))
      localStorage.setItem('lastLetter', 'o')
      localStorage.setItem('history', JSON.stringify([]))
    }
  }, [])

  const data = { token, setToken, loginStatus, setLoginStatus, userInfo, setUserInfo, lastLetter, setLastLetter, history, setHistory }
  return (
    <AuthContext.Provider value={data}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
