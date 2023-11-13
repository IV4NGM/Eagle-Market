import { Navigate } from 'react-router-dom'

const LoggedRedirect = () => {
  if (localStorage.getItem('token')) {
    return <Navigate to='/' />
  }
}

export default LoggedRedirect
