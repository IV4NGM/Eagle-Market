/* eslint-disable react/prop-types */
// import useAuthContext from '@/Context/AuthContext/useAuthContext'
import { useNavigate } from 'react-router-dom'

const nothingFunction = () => {}

const CartProductCard = ({ data, changeValueFunction = nothingFunction, type = '', onDelete = nothingFunction, changeable = true }) => {
  const navigate = useNavigate()
  // const { userInfo } = useAuthContext()
  return (
    <div
      className='card' style={{ width: '80%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }} onClick={(event) => {
        event.stopPropagation()
        navigate(`/product/${data?.id}`)
      }}
    >
      <p><strong>{data?.product_name}</strong></p>
      {changeable
        ? <button onClick={(event) => {
          event.stopPropagation()
          changeValueFunction(type, data?.product_amount - 1, data?.id)
        }}
          >
          -
          </button>
        : ''}
      <p>Cantidad: {data.product_amount}</p>
      {changeable
        ? <button onClick={(event) => {
          event.stopPropagation()
          changeValueFunction(type, data?.product_amount + 1, data?.id)
        }}
          >
          +
        </button>
        : ''}

      <p>Precio individual: ${data.price}</p>
      <p><strong>Total: ${data.price * data.product_amount}</strong></p>
      {changeable
        ? <button onClick={(event) => {
          event.stopPropagation()
          onDelete()
        }}
          >X
        </button>
        : ''}

    </div>
  )
}

export default CartProductCard
