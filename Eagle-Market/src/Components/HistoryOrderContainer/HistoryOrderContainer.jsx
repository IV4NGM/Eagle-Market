/* eslint-disable react/prop-types */
import CartProductCard from '@/Components/CartProductCard/CartProductCard'

const nothingFunction = () => {}

const HistoryOrderContainer = ({ totalPrice, productsAmount, orderId, orderDate, orderTime, productsArray, onClick = nothingFunction }) => {
  return (
    <div
      className='card' style={{ width: '80%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }} onClick={(event) => {
        event.stopPropagation()
        onClick()
      }}
    >
      <div className='card-body'>
        <h5 className='card-title'>Orden {orderId}</h5>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <p>{orderDate}</p>
          <p>{orderTime}</p>
          <p>{productsAmount} productos</p>
          <p>Precio total: ${totalPrice}</p>
        </div>
        {productsArray.map((element, index) => {
          return <CartProductCard key={index} data={element} changeable={false} />
        })}
      </div>
    </div>
  )
}

export default HistoryOrderContainer
