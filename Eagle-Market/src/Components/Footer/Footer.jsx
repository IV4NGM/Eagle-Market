import { Link } from 'react-router-dom'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import './Footer.scss'

const Footer = () => {
  return (
    <div className='footer-container'>
      <nav className='navbar bottom footer navbar-white'>
        <div className='container-fluid footer-body center-content-on-small'>
          <p className='bold-text'>Eagle Market 2023</p>
          <p className='hide-on-small'>Designed by Iván G M</p>
          <div className='mail-footer hide-on-small'>
            <EmailOutlinedIcon />
            <Link to='mailto:ivangm_01@hotmail.com' className='mail-icon-footer'>
              ivangm_01@hotmail.com
            </Link>
          </div>
        </div>
      </nav>
    </div>

  )
}

export default Footer
