import useAuthContext from '@/Context/AuthContext/useAuthContext'
import { useState } from 'react'
import CustomModal from '@/Components/CustomModal/CustomModal'
import HistoryOrderContainer from '@/Components/HistoryOrderContainer/HistoryOrderContainer'
import { useNavigate } from 'react-router-dom'
import useHistoryApi from '@/Hooks/useHistoryApi'
import NoLoggedRedirect from '@/Context/AuthContext/NoLoggedRedirect'

const MyOrders = () => {
  const { token, history } = useAuthContext()
  const navigate = useNavigate()

  const [showModalFailure, setShowModalFailure] = useState(false)
  const historyLoaded = useHistoryApi()

  // useEffect(() => {
  //   console.log('Getting')
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
  //     console.log(result)
  //     if (result.ok) {
  //       return result.json()
  //     } else {
  //       throw new Error('Error in the server response')
  //     }
  //     // return result.json()
  //   })
  //     .then((result) => {
  //       console.log(result.data)
  //       setApiCall(true)
  //       sessionStorage.setItem('history', JSON.stringify(result.data))
  //       setHistory(result.data)
  //       console.log('history', history)
  //     })
  //     .catch((e) => {
  //       setApiCall(true)
  //       console.log(e)
  //       setShowModalFailure(true)
  //     })
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [token])

  return (
    <>
      <NoLoggedRedirect />
      <h2>Historial de compras</h2>
      {historyLoaded && history.length === 0 ? 'No hay compras realizadas todavía' : ''}
      {history
        ? history.map((element, index) => {
          return <HistoryOrderContainer key={index} totalPrice={element?.total_price} productsAmount={element?.products_amount} orderId={element?.orderId} orderDate={element?.orderDate} orderTime={element?.orderTime} productsArray={element?.products} onClick={() => navigate(`/my-orders/${element?.orderId}`)} />
        })
        : ''}
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
