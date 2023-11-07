import useAuthContext from '@/Context/AuthContext/useAuthContext'
import useProductsContext from '@/Context/ProductsContext/useProductsContext'
import { useState, useEffect } from 'react'

const useHistoryApi = () => {
  const { token, setHistory } = useAuthContext()
  const { setApiCall } = useProductsContext()
  const [historyLoaded, setHistoryLoaded] = useState(false)

  useEffect(() => {
    if (token) {
      setApiCall(false)
      const getProducts = fetch('https://eagle-market.onrender.com/orders-history', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
      getProducts.then((result) => {
        if (result.ok) {
          return result.json()
        } else {
          throw new Error('Error in the server response')
        }
      })
        .then((result) => {
          sessionStorage.setItem('history', JSON.stringify(result.data))
          setHistory(result.data)
          setHistoryLoaded(true)
          console.log('Historial correcto')
          setApiCall(true)
        })
        .catch((e) => {
          console.log('Hisorial incorrecto', e)
          setHistoryLoaded(false)
          setApiCall(true)
        })
    }
  }, [token])

  return historyLoaded
}

export default useHistoryApi
