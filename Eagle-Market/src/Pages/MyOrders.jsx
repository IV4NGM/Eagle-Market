import useAuthContext from '@/Context/AuthContext/useAuthContext'
import { useEffect, useState } from 'react'
import CustomModal from '@/Components/CustomModal/CustomModal'
import useProductsContext from '@/Context/ProductsContext/useProductsContext'

const MyOrders = () => {
  const { token } = useAuthContext()

  const { setApiCall } = useProductsContext()
  const [history, setHistory] = useState({})
  // const [callApi, setCallApi] = useState(true)
  const [showModalFailure, setShowModalFailure] = useState(false)

  useEffect(() => {
    console.log('Getting')
    setApiCall(false)
    const getProducts = fetch('https://eagle-market.onrender.com/orders-history', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
    getProducts.then((result) => {
      // setApiCall(true)
      console.log(result)
      if (result.ok) {
        return result.json()
      } else {
        throw new Error('Error in the server response')
      }
      // return result.json()
    })
      .then((result) => {
        console.log(result.data)
        setApiCall(true)
        setHistory(result.data)
      })
      .catch((e) => {
        setApiCall(true)
        console.log(e)
        setShowModalFailure(true)
      })
  }, [setApiCall, token])

  return (
    <>
      <div>MyOrders</div>
      <p>Working history...</p>
      <p>{history[0]?.total_price}</p>
      <CustomModal
        title='Error al cargar el historial'
        showModal={showModalFailure}
        setShowModal={setShowModalFailure}
        text='Hubo un error al intentar cargar el historial de compras. Intente de nuevo más tarde'
        isCancelButton={false}
        textYes='Regresar'
        estatico
      />
    </>

  )
}

export default MyOrders
