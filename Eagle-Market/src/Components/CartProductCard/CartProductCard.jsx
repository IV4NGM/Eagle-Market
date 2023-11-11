/* eslint-disable react/prop-types */
// import useAuthContext from '@/Context/AuthContext/useAuthContext'
import { useNavigate } from 'react-router-dom'
import './CartProductCard.scss'
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined'
import ProductDefaultImage from '@/assets/product-default-image.png'

const nothingFunction = () => {}

const CartProductCard = ({ data, changeValueFunction = nothingFunction, type = '', onDelete = nothingFunction, changeable = true }) => {
  const navigate = useNavigate()
  // const { userInfo } = useAuthContext()
  return (
    <div
      className='card cart-product-card'onClick={(event) => {
        event.stopPropagation()
        navigate(`/product/${data?.id}`)
      }}
    >
      <div className='cart-image-container'>
        <img src={data?.image || data?.base64Image || ProductDefaultImage} alt={data?.product_name} className='product-image-card product-image-card--mini' />
      </div>
      <div className='flex-column'>
        <p><strong>{data?.product_name}</strong></p>
        <p>{data?.brand}</p>
      </div>
      {/* <div className='flex-row amount-container'>
        <p className='amount-container-left'>-</p>
        <p>3</p>
        <p className='amount-container-right'>+</p>
      </div> */}
      <div className='flex-row amount-container'>
        {changeable
          ? <button
              className='amount-container-left btn btn-modify-number' onClick={(event) => {
                event.stopPropagation()
                changeValueFunction(type, data?.product_amount - 1, data?.id)
              }}
            >
            <RemoveOutlinedIcon />
            </button>
          : ''}
        <div className='amount-container-number'>{data.product_amount}</div>
        {changeable
          ? <button
              className='amount-container-right btn btn-modify-number' onClick={(event) => {
                event.stopPropagation()
                changeValueFunction(type, data?.product_amount + 1, data?.id)
              }}
            >
            <AddOutlinedIcon />
            </button>
          : ''}
      </div>

      <p>Precio individual: ${data.price}</p>
      <p><strong>Total: ${data.price * data.product_amount}</strong></p>
      {changeable
        ? <button className='btn btn-outline-danger' onClick={(event) => {
          event.stopPropagation()
          onDelete()
        }}
          >
          <ClearOutlinedIcon />
          </button>
        : ''}

    </div>
  )
}

export default CartProductCard
