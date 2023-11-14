import { Navigate } from 'react-router-dom'

const NoLoggedRedirect = () => {
  if (!localStorage.getItem('token')) {
    return <Navigate to='/login' />
  }
}

export default NoLoggedRedirect
