import { Navigate } from 'react-router-dom'

// eslint-disable-next-line react/prop-types
const NoLoggedRedirect = () => {
  if (!sessionStorage.getItem('token')) {
    return <Navigate to='/login' />
  }
}

export default NoLoggedRedirect
