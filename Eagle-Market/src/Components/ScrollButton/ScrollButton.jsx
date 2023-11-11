import { useState } from 'react'
import ArrowUpwardOutlinedIcon from '@mui/icons-material/ArrowUpwardOutlined'
import './ScrollButton.scss'

const ScrollButton = () => {
  const [visible, setVisible] = useState(false)

  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop
    if (scrolled > 300) {
      setVisible(true)
    } else if (scrolled <= 300) {
      setVisible(false)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  window.addEventListener('scroll', toggleVisible)
  return (
    <button onClick={scrollToTop} style={{ display: visible ? 'flex' : 'none' }} className='scroll-button'>
      <ArrowUpwardOutlinedIcon />
    </button>
  )
}

export default ScrollButton
