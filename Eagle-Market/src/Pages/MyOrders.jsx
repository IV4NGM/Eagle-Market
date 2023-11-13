import useAuthContext from '@/Context/AuthContext/useAuthContext'
import { useState } from 'react'
import CustomModal from '@/Components/CustomModal/CustomModal'
import HistoryOrderContainer from '@/Components/HistoryOrderContainer/HistoryOrderContainer'
import { useNavigate } from 'react-router-dom'
import useHistoryApi from '@/Hooks/useHistoryApi'
import NoLoggedRedirect from '@/Context/AuthContext/NoLoggedRedirect'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'

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
  //       localStorage.setItem('history', JSON.stringify(result.data))
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
    <div className='page-container'>
      <NoLoggedRedirect />
      <h2 className='spaced'>Mis compras</h2>
      {historyLoaded && history.length === 0
        ? <><SearchOutlinedIcon className='not-found-image' />
          <h4>Todavía no has realizado ninguna compra</h4>
          <h4>Vuelve al inicio para seguir comprando</h4>
          <button className='btn btn-success btn-lg spaced' onClick={() => navigate('/')}>Ir a Inicio</button>
        </>
        : <div className='flex-column orders-container'>
          {history.map((element, index) => {
            return <HistoryOrderContainer key={index} totalPrice={element?.total_price} productsAmount={element?.products_amount} orderId={element?.orderId} orderDate={element?.localOrderDate} orderTime={element?.localOrderTime} productsArray={element?.products} onClick={() => navigate(`/my-orders/${element?.orderId}`)} />
          })}
          </div>}
      {/* {history
        ? history.map((element, index) => {
          return <HistoryOrderContainer key={index} totalPrice={element?.total_price} productsAmount={element?.products_amount} orderId={element?.orderId} orderDate={element?.orderDate} orderTime={element?.orderTime} productsArray={element?.products} onClick={() => navigate(`/my-orders/${element?.orderId}`)} />
        })
        : ''} */}
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

export default MyOrders
