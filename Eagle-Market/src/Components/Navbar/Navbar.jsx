import { NavLink, useNavigate } from 'react-router-dom'
import './Navbar.scss'

import useAuthContext from '@/Context/AuthContext/useAuthContext'
import useProductsContext from '@/Context/ProductsContext/useProductsContext'

const Navbar = () => {
  const navigate = useNavigate()

  const { loginStatus, userInfo } = useAuthContext()
  const { navSearch, setNavSearch } = useProductsContext()
  return (
    <nav className='navbar navbar-expand-lg bg-body-tertiary sticky-top' data-bs-theme='dark'>
      <div className='container-fluid'>
        <NavLink className='navbar-brand' to='/' onClick={() => setNavSearch('')}>
          <img src='https://flaticons.net/icon.php?slug_category=wildlife&slug_icon=eagle' alt='Eagle blade logo' className='d-inline-block align-text-top logo-nav' />
          <p>Eagle Market</p>
        </NavLink>
        <button className='navbar-toggler' type='button' data-bs-toggle='collapse' data-bs-target='#navbarSupportedContent'>
          <span className='navbar-toggler-icon' />
        </button>
        <div className='collapse navbar-collapse' id='navbarSupportedContent'>
          <ul className='navbar-nav me-auto mb-2 mb-lg-0'>
            <li className='nav-item'>
              <a className='nav-link active'>Todos tus productos</a>
            </li>
          </ul>
          <p className='blanco'>Bienvenido {userInfo.first_name}</p>
          {loginStatus && userInfo?.role === 'ADMIN' ? <NavLink to='/new-product'>Crear nuevo producto</NavLink> : ''}
          <input
            type='text'
            value={navSearch}
            onChange={(event) => setNavSearch(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                navigate('/')
              }
            }}
          />
          <div className='d-flex'>
            {!loginStatus
              ? <> <NavLink className='navbar-brand' to='/signup'>Registrarse</NavLink> <NavLink className='navbar-brand' to='/login'>Iniciar Sesión</NavLink> </>
              : <> <NavLink to='/checkout'>Ver carrito</NavLink> <NavLink className='navbar-brand' to='/logout'>Cerrar Sesión</NavLink></>}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
