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
        ? <div
            className='edit-icon' onClick={(event) => {
              event.stopPropagation()
              navigate(`/edit/${data?.id}`)
            }}
          ><EditOutlinedIcon />
        </div>
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
        <h5><strong>{data?.product_name}</strong></h5>
        <h6>{data?.brand}</h6>
        <h5 className='card-text__success-color'>${data?.price}</h5>
        {/* <a href='#' className='btn btn-success' onClick={(event) => event.stopPropagation()}>Agregar al carrito</a> */}
        {/* {userInfo?.role === 'ADMIN' ? <a href='#' className='btn btn-danger' onClick={(event) => event.stopPropagation()}>Eliminar producto</a> : ''} */}
        <button className='btn btn-success card-button mt-auto'>Ver detalles</button>
      </div>
    </div>

  )
}

export default ProductCard
