import { useContext } from 'react'
import CartContext from '@/Context/CartContext/CartContext'

const useCartContext = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useProductsContext must be used within a ProductsProvider')
  }
  return context
}

export default useCartContext
