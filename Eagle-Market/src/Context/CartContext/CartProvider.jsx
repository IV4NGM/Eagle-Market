import { useEffect, useState } from 'react'
import CartContext from '@/Context/CartContext/CartContext'

// eslint-disable-next-line react/prop-types
const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])
  const [productToBuy, setProductToBuy] = useState({})

  useEffect(() => {
    if (localStorage.getItem('cart')) {
      setCart(JSON.parse(localStorage.getItem('cart')))
    }
  }, [])

  const data = { cart, setCart, productToBuy, setProductToBuy }
  return (
    <CartContext.Provider value={data}>
      {children}
    </CartContext.Provider>
  )
}

export default CartProvider
