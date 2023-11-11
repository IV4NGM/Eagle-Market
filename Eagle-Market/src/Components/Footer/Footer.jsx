import { Link } from 'react-router-dom'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import './Footer.scss'

const Footer = () => {
  return (
    <div className='footer-container'>
      <nav className='navbar bottom footer navbar-white'>
        <div className='container-fluid footer-body'>
          <p className='bold-text'>Eagle Market 2023</p>
          {/* <div className='attribution'>
          <img src='https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_1-5bdc75aaebeb75dc7ae79426ddd9be3b2be1e342510f8202baf6bffa71d7f5c4.svg' alt='TMDB logo' />
          <p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
        </div> */}
          <p>Designed by Iván G M</p>
          <div className='mail-footer'>
            <EmailOutlinedIcon />
            <Link to='mailto:ivangm_01@hotmail.com'>
              ivangm_01@hotmail.com
            </Link>
          </div>
        </div>
      </nav>
    </div>

  )
}

export default Footer
