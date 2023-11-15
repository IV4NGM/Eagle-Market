/* eslint-disable react/prop-types */
// import useAuthContext from '@/Context/AuthContext/useAuthContext'
import { useNavigate } from 'react-router-dom'
import './CartProductCard.scss'
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined'
import ProductDefaultImage from '@/assets/product-default-image.png'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'

const nothingFunction = () => {}

const CartProductCard = ({ data, changeValueFunction = nothingFunction, type = '', onDelete = nothingFunction, changeable = true }) => {
  const navigate = useNavigate()
  const border = (classNames, changeable) => {
    if (!changeable) {
      return classNames + ' no-border'
    } else {
      return classNames
    }
  }
  const totalPrice = Math.round(data.price * data.product_amount * 100) / 100
  return (
    <div
      className={changeable ? 'card cart-product-card' : 'card cart-product-card history-cart-card'} onClick={(event) => {
        event.stopPropagation()
        navigate(`/product/${data?.id}`)
      }}
    >
      <div className='image-and-info-container flex-row'>
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
      </div>
      <div className={border('flex-row amount-container', changeable)}>
        {changeable
          ? (
            <div className='amount-container-left'>
              <button
                className='btn btn-modify-number' onClick={(event) => {
                  event.stopPropagation()
                  changeValueFunction(type, data?.product_amount - 1, data?.id)
                }}
              >
                <RemoveOutlinedIcon />
              </button>
            </div>
            )
          : ''}
        <div className='amount-container-number'>{!changeable ? <ShoppingBagOutlinedIcon /> : ''} {data.product_amount} {!changeable ? 'productos' : ''}</div>
        {changeable
          ? (
            <div className='amount-container-right'>
              <button
                className='btn btn-modify-number' onClick={(event) => {
                  event.stopPropagation()
                  changeValueFunction(type, data?.product_amount + 1, data?.id)
                }}
              >
                <AddOutlinedIcon />
              </button>
            </div>
            )
          : ''}
      </div>
      <div className='flex-row cart-price-row'>
        <p>Precio individual: ${data.price}</p>
        <p><strong>Total: ${totalPrice}</strong></p>
      </div>
      {changeable
        ? (
          <button
            className='btn btn-outline-danger delete-product-card-button' onClick={(event) => {
              event.stopPropagation()
              onDelete()
            }}
          >
            <ClearOutlinedIcon />
          </button>
          )
        : ''}

    </div>
  )
}

export default CartProductCard
