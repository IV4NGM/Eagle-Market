import CustomModal from '@/Components/CustomModal/CustomModal'
import HistoryOrderContainer from '@/Components/HistoryOrderContainer/HistoryOrderContainer'
import NoLoggedRedirect from '@/Context/AuthContext/NoLoggedRedirect'
import useAuthContext from '@/Context/AuthContext/useAuthContext'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined'
import useProductsContext from '@/Context/ProductsContext/useProductsContext'

const OrderDetail = () => {
  const { token, history, setHistory } = useAuthContext()
  const { setApiCall } = useProductsContext()
  const navigate = useNavigate()

  const { id } = useParams()

  const [showModalFailure, setShowModalFailure] = useState(false)
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
          setApiCall(true)
          setHistoryLoaded(true)
          setHistory(result.data)
        })
        .catch((e) => {
          setApiCall(true)
          setHistoryLoaded(false)
          setShowModalFailure(true)
        })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])
  const element = history.filter((order) => order.orderId === Number(id))[0]

  return (
    <div className='page-container'>
      <NoLoggedRedirect />
      <h2 className='spaced'>Detalles de tu compra</h2>
      {element
        ? (
          <div className='flex-row cart-flex'>
            <div className='cart-flex-left cart-flex-left--history'>
              <HistoryOrderContainer totalPrice={element?.total_price} productsAmount={element?.products_amount} orderId={element?.orderId} orderDate={element?.localOrderDate} orderTime={element?.localOrderTime} productsArray={element?.products} />
            </div>
            <div className='cart-flex-right'>
              <div className='card cart-checkout-details'>
                <h4>Detalles de la compra</h4>
                <div className='flex-column spaced order-date'>
                  <p><CalendarMonthOutlinedIcon /> {element?.localOrderDate}</p>
                  <p><AccessTimeOutlinedIcon /> {element?.localOrderTime}</p>
                </div>
                <div className='cart-details-grid spaced'>
                  <p>ID de la orden:</p>
                  <p className='right'>{element?.orderId}</p>
                  <p>Productos:</p>
                  <p className='right'>{element?.products_amount}</p>
                  <p><strong>Gran total: </strong></p>
                  <p className='right'><strong>$ {element?.total_price}</strong></p>
                </div>
              </div>
            </div>
          </div>
          )
        : ''}
      {historyLoaded && !element
        ? (
          <>
            <SearchOutlinedIcon className='not-found-image' />
            <h4>No tenemos registro de esta compra</h4>
            <h4>Vuelve al inicio para seguir comprando</h4>
            <button className='btn btn-success btn-lg spaced' onClick={() => navigate('/')}>Ir a Inicio</button>
          </>
          )
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
    </div>
  )
}

export default OrderDetail
