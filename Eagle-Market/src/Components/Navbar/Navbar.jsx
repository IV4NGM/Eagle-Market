import './Navbar.scss'
import eagleLogo from '@/assets/eagle.png'
import Search from '@mui/icons-material/Search'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'

import { NavLink, useNavigate } from 'react-router-dom'
import useAuthContext from '@/Context/AuthContext/useAuthContext'
import useProductsContext from '@/Context/ProductsContext/useProductsContext'
import useCartContext from '@/Context/CartContext/useCartContext'

const Navbar = () => {
  const navigate = useNavigate()

  const { loginStatus, userInfo, lastLetter } = useAuthContext()
  const { navSearch, setNavSearch, setAdvancedSearch } = useProductsContext()
  const { cart } = useCartContext()

  let productsAmount = 0
  for (const item of cart) {
    productsAmount += item.product_amount
  }

  return (
    <nav className='navbar navbar-expand-lg bg-body-tertiary sticky-top'>
      <div className='container-fluid'>
        <NavLink className='navbar-brand' to='/' onClick={() => setNavSearch('')}>
          <img src={eagleLogo} alt='Eagle blade logo' className='d-inline-block align-text-top logo-nav' />
          <p>Eagle Market</p>
        </NavLink>
        <div className='navbar__input-group input-group'>
          <input
            type='text'
            value={navSearch}
            onChange={(event) => setNavSearch(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                setAdvancedSearch(navSearch)
                setNavSearch('')
                navigate('/search')
              }
            }}
            placeholder='Busca en todo Eagle Market'
            className='navbar__nav-search'
          />
          <div className='input-group-text'><Search /></div>
          <NavLink to='/search' className='navbar__advanced-search'>
            Búsqueda avanzada
          </NavLink>
        </div>
      </div>
      <button className='navbar-toggler' type='button' data-bs-toggle='collapse' data-bs-target='#navbarSupportedContent'>
        <span className='navbar-toggler-icon' />
      </button>
      <div className='collapse navbar-collapse' id='navbarSupportedContent'>
        <div className='navbar-nav me-auto mb-2 mb-lg-0'>
          {loginStatus && userInfo?.role === 'ADMIN' ? <NavLink to='/new-product'>Crear nuevo producto</NavLink> : ''}

          <div className='d-flex'>
            {!loginStatus
              ? <> <NavLink className='navbar-brand' to='/signup'>Registrarse</NavLink>
                <NavLink className='navbar-brand' to='/login'>Iniciar Sesión</NavLink>
                </>
              : <>
                <NavLink to='/checkout' className='shopping-cart-icon'><ShoppingCartIcon /><span className='shopping-cart-number'>{productsAmount}</span></NavLink>
                <div className='dropdown navbar__dropdown'>
                  <button className='btn btn-secondary dropdown-toggle' type='button' data-bs-toggle='dropdown'>
                    {userInfo.first_name} {userInfo.last_name}
                  </button>
                  <ul className='dropdown-menu'>
                    <li>{userInfo.email}</li>
                    <li><NavLink to='/my-orders'>Historial</NavLink></li>
                    <li><NavLink className='navbar-brand' to='/logout'>Cerrar Sesión</NavLink></li>
                  </ul>
                </div>
                </>}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
