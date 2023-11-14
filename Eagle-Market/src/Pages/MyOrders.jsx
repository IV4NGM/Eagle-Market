import useAuthContext from '@/Context/AuthContext/useAuthContext'
import { useState, useEffect } from 'react'
import CustomModal from '@/Components/CustomModal/CustomModal'
import HistoryOrderContainer from '@/Components/HistoryOrderContainer/HistoryOrderContainer'
import { useNavigate } from 'react-router-dom'
import NoLoggedRedirect from '@/Context/AuthContext/NoLoggedRedirect'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import useProductsContext from '@/Context/ProductsContext/useProductsContext'

const MyOrders = () => {
  const { token, history, setHistory } = useAuthContext()
  const { setApiCall } = useProductsContext()
  const navigate = useNavigate()

  const [showModalFailure, setShowModalFailure] = useState(false)
  const [historyLoaded, setHistoryLoaded] = useState(false)

  useEffect(() => {
    if (token) {
      console.log('Getting history')
      setApiCall(false)
      const getProducts = fetch('https://eagle-market.onrender.com/orders-history', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
      getProducts.then((result) => {
        console.log(result)
        if (result.ok) {
          return result.json()
        } else {
          throw new Error('Error in the server response')
        }
      })
        .then((result) => {
          console.log(result.data)
          setApiCall(true)
          setHistoryLoaded(true)
          localStorage.setItem('history', JSON.stringify(result.data))
          setHistory(result.data)
          console.log('history', history)
        })
        .catch((e) => {
          setApiCall(true)
          setHistoryLoaded(false)
          console.log(e)
          setShowModalFailure(true)
        })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  return (
    <div className='page-container'>
      <NoLoggedRedirect />
      <h2 className='spaced'>Mis compras</h2>
      {historyLoaded && history.length === 0
        ? (
          <>
            <SearchOutlinedIcon className='not-found-image' />
            <h4>Todavía no has realizado ninguna compra</h4>
            <h4>Vuelve al inicio para seguir comprando</h4>
            <button className='btn btn-success btn-lg spaced' onClick={() => navigate('/')}>Ir a Inicio</button>
          </>
          )
        : (
          <div className='flex-column orders-container'>
            {history.map((element, index) => {
              return <HistoryOrderContainer key={index} totalPrice={element?.total_price} productsAmount={element?.products_amount} orderId={element?.orderId} orderDate={element?.localOrderDate} orderTime={element?.localOrderTime} productsArray={element?.products} onClick={() => navigate(`/my-orders/${element?.orderId}`)} />
            })}
          </div>
          )}
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
