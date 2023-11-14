/* eslint-disable react/prop-types */
import useAuthContext from '@/Context/AuthContext/useAuthContext'
import { useNavigate } from 'react-router-dom'
import ProductDefaultImage from '@/assets/product-default-image.png'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import './ProductCard.scss'

const ProductCard = ({ data }) => {
  const navigate = useNavigate()
  const { userInfo } = useAuthContext()
  return (
    <div className='card product-card' onClick={() => navigate(`/product/${data?.id}`)}>
      {userInfo?.role === 'ADMIN'
        ? (
          <div
            className='edit-icon' onClick={(event) => {
              event.stopPropagation()
              navigate(`/edit/${data?.id}`)
            }}
          ><EditOutlinedIcon />
          </div>
          )
        : ''}
      <div className='card-image-container'>
        <img
          src={data?.image || data?.base64Image || ProductDefaultImage} className='card-img-top product-image-card' alt={data?.product_name} onError={({ currentTarget }) => {
            currentTarget.onerror = null
            currentTarget.src = ProductDefaultImage
          }}
        />
      </div>
      <div className='card-body d-flex flex-column h-100 w-100'>
        <h5 className='long-text-overflow long-text-overflow--3'><strong>{data?.product_name}</strong></h5>
        <h6 className='long-text-overflow long-text-overflow--1'>{data?.brand}</h6>
        <h5 className='card-text__success-color'>${data?.price}</h5>
        <button className='btn btn-success card-button mt-auto'>Ver detalles</button>
      </div>
    </div>
  )
}

export default ProductCard
