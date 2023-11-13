/* eslint-disable react/prop-types */
import { Navigate } from 'react-router-dom'

const NoAdminRedirect = () => {
  if (JSON.parse(localStorage.getItem('userInfo'))?.role !== 'ADMIN') {
    return <Navigate to='/' />
  }
}

export default NoAdminRedirect
