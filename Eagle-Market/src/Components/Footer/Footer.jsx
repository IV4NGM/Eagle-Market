import { Link } from 'react-router-dom'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import './Footer.scss'

const Footer = () => {
  return (
    <div className='footer-container'>
      <nav className='navbar bottom footer navbar-white'>
        <div className='container-fluid footer-body'>
          <p className='bold-text'>Eagle Market 2023</p>
          <p>Designed by Iván G M</p>
          <div className='mail-footer'>
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
