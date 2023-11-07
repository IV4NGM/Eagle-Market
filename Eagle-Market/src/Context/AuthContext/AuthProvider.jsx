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
    if (sessionStorage.getItem('token')) {
      setToken(sessionStorage.getItem('token'))
      setLoginStatus(sessionStorage.getItem('loginStatus'))
      setUserInfo(JSON.parse(sessionStorage.getItem('userInfo')))
      setLastLetter(sessionStorage.getItem('lastLetter'))
      setHistory(JSON.parse(sessionStorage.getItem('history')))
    } else {
      sessionStorage.setItem('token', '')
      sessionStorage.setItem('loginStatus', JSON.stringify(false))
      sessionStorage.setItem('userInfo', JSON.stringify({}))
      sessionStorage.setItem('lastLetter', 'o')
      sessionStorage.setItem('history', JSON.stringify([]))
    }
  }, [])
  console.log(userInfo)
  console.log(history)

  const data = { token, setToken, loginStatus, setLoginStatus, userInfo, setUserInfo, lastLetter, setLastLetter, history, setHistory }
  return (
    <AuthContext.Provider value={data}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
