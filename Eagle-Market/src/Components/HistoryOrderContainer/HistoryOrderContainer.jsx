/* eslint-disable react/prop-types */
import CartProductCard from '@/Components/CartProductCard/CartProductCard'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'

const nothingFunction = () => {}

const HistoryOrderContainer = ({ totalPrice, productsAmount, orderId, orderDate, orderTime, productsArray, onClick = nothingFunction }) => {
  return (
    <div
      className='card order-container' onClick={(event) => {
        event.stopPropagation()
        onClick()
      }}
    >
      <div className='card-body history-card-body'>
        <h4 className='card-title'>Orden {orderId}</h4>
        <div className='flex-row order-summary'>
          <p><CalendarMonthOutlinedIcon /> {orderDate}</p>
          <p><AccessTimeOutlinedIcon /> {orderTime}</p>
          <p><ShoppingBagOutlinedIcon /> {productsAmount} productos</p>
          <p><strong>Precio total: ${totalPrice}</strong></p>
        </div>
        <div className='history-cards-container spaced'>
          {productsArray.map((element, index) => {
            return <CartProductCard key={index} data={element} changeable={false} />
          })}
        </div>
      </div>
    </div>
  )
}

export default HistoryOrderContainer
