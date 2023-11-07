import { Navigate } from 'react-router-dom'

const LoggedRedirect = () => {
  if (sessionStorage.getItem('token')) {
    return <Navigate to='/' />
  }
}

export default LoggedRedirect
