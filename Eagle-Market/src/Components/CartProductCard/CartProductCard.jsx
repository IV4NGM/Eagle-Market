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
  const border = (classNames, changeable) => {
    if (!changeable) {
      return classNames + ' no-border'
    } else {
      return classNames
    }
  }
  return (
    <div
      className='card cart-product-card'onClick={(event) => {
        event.stopPropagation()
        navigate(`/product/${data?.id}`)
      }}
    >
      <div className='cart-image-container'>
        <img
          src={data?.image || data?.base64Image || ProductDefaultImage} alt={data?.product_name} className='product-image-card product-image-card--mini' onError={({ currentTarget }) => {
            currentTarget.onerror = null
            currentTarget.src = ProductDefaultImage
          }}
        />
      </div>
      <div className='flex-column cart-details-product'>
        <p className='long-text-overflow long-text-overflow--3'><strong>{data?.product_name}</strong></p>
        <p className='long-text-overflow long-text-overflow--1'>{data?.brand}</p>
      </div>
      {/* <div className='flex-row amount-container'>
        <p className='amount-container-left'>-</p>
        <p>3</p>
        <p className='amount-container-right'>+</p>
      </div> */}
      <div className={border('flex-row amount-container', changeable)}>
        {changeable
          ? <div className='amount-container-left'>
            <button
              className='btn btn-modify-number' onClick={(event) => {
                event.stopPropagation()
                changeValueFunction(type, data?.product_amount - 1, data?.id)
              }}
            >
              <RemoveOutlinedIcon />
            </button>
          </div>

          : ''}
        <div className='amount-container-number'>{data.product_amount} {!changeable ? 'artículos' : ''}</div>
        {changeable
          ? <div className='amount-container-right'>
            <button
              className='btn btn-modify-number' onClick={(event) => {
                event.stopPropagation()
                changeValueFunction(type, data?.product_amount + 1, data?.id)
              }}
            >
              <AddOutlinedIcon />
            </button>
            </div>
          : ''}
      </div>
      <p>Precio individual: ${data.price}</p>
      <p><strong>Total: ${data.price * data.product_amount}</strong></p>
      {changeable
        ? <button
            className='btn btn-outline-danger' onClick={(event) => {
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
