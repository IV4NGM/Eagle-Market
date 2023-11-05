import { NavLink, useNavigate } from 'react-router-dom'
import './Navbar.scss'
import eagleLogo from '@/assets/eagle.png'

import useAuthContext from '@/Context/AuthContext/useAuthContext'
import useProductsContext from '@/Context/ProductsContext/useProductsContext'
import useCartContext from '@/Context/CartContext/useCartContext'

const Navbar = () => {
  const navigate = useNavigate()

  const { loginStatus, userInfo, lastLetter } = useAuthContext()
  const { navSearch, setNavSearch } = useProductsContext()
  const { cart } = useCartContext()

  let productsAmount = 0
  for (const item of cart) {
    productsAmount += item.product_amount
  }

  return (
    <nav className='navbar navbar-expand-lg bg-body-tertiary sticky-top' data-bs-theme='dark'>
      <div className='container-fluid'>
        <NavLink className='navbar-brand' to='/' onClick={() => setNavSearch('')}>
          <img src={eagleLogo} alt='Eagle blade logo' className='d-inline-block align-text-top logo-nav' />
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
          <p className='blanco'>Bienvenid{lastLetter} {userInfo.first_name}</p>
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
              : <> <NavLink to='/my-orders'>Historial</NavLink> <NavLink to='/checkout'>Ver carrito</NavLink> <p style={{ color: 'white' }}><strong>{productsAmount}</strong> elementos</p> <NavLink className='navbar-brand' to='/logout'>Cerrar Sesión</NavLink></>}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
