import CustomModal from '@/Components/CustomModal/CustomModal'
import HistoryOrderContainer from '@/Components/HistoryOrderContainer/HistoryOrderContainer'
import NoLoggedRedirect from '@/Context/AuthContext/NoLoggedRedirect'
import useAuthContext from '@/Context/AuthContext/useAuthContext'
import useHistoryApi from '@/Hooks/useHistoryApi'
import { useState } from 'react'
import { useParams } from 'react-router-dom'

const OrderDetail = () => {
  const { token, history } = useAuthContext()

  const { id } = useParams()

  const [showModalFailure, setShowModalFailure] = useState(false)
  const historyLoaded = useHistoryApi()
  // useEffect(() => {
  //   // console.log('Getting')
  //   setApiCall(false)
  //   const getProducts = fetch('https://eagle-market.onrender.com/orders-history', {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Authorization: `Bearer ${token}`
  //     }
  //   })
  //   getProducts.then((result) => {
  //     // setApiCall(true)
  //     // console.log(result)
  //     if (result.ok) {
  //       return result.json()
  //     } else {
  //       throw new Error('Error in the server response')
  //     }
  //     // return result.json()
  //   })
  //     .then((result) => {
  //       // console.log(result.data)
  //       setApiCall(true)
  //       setHistory(result.data)
  //       // console.log('history', history)
  //     })
  //     .catch((e) => {
  //       setApiCall(true)
  //       // console.log(e)
  //       setShowModalFailure(true)
  //     })
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [token])
  const element = history.filter((order) => order.orderId === Number(id))[0]

  return (
    <div className='page-container'>
      <NoLoggedRedirect />
      {element ? <HistoryOrderContainer totalPrice={element?.total_price} productsAmount={element?.products_amount} orderId={element?.orderId} orderDate={element?.orderDate} orderTime={element?.orderTime} productsArray={element?.products} /> : ''}
      {historyLoaded && !element ? 'Esta compra no existe.' : ''}
      <CustomModal
        title='Error al cargar el historial'
        showModal={showModalFailure}
        setShowModal={setShowModalFailure}
        text='Hubo un error al intentar cargar el historial de compras. Intente de nuevo más tarde'
        isCancelButton={false}
        textYes='Regresar'
        estatico
      />
    </div>
  )
}

export default OrderDetail
