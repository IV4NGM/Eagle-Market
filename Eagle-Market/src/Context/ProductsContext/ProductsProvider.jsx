import { useState } from 'react'
import ProductsContext from '@/Context/ProductsContext/ProductsContext'

// eslint-disable-next-line react/prop-types
const ProductsProvider = ({ children }) => {
  const [navSearch, setNavSearch] = useState('')
  const [apiCall, setApiCall] = useState(true)
  const data = { navSearch, setNavSearch, apiCall, setApiCall }
  return (
    <ProductsContext.Provider value={data}>
      {children}
    </ProductsContext.Provider>
  )
}

export default ProductsProvider
