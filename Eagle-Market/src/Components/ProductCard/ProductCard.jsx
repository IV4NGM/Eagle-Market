/* eslint-disable react/prop-types */
// import useAuthContext from '@/Context/AuthContext/useAuthContext'
import { useNavigate } from 'react-router-dom'
import ProductDefaultImage from '@/assets/product-default-image.png'

const ProductCard = ({ data }) => {
  const navigate = useNavigate()
  // const { userInfo } = useAuthContext()
  return (
    <div className='card product-card' onClick={() => navigate(`/product/${data?.id}`)}>
      <img src={data?.image || data?.base64Image || ProductDefaultImage} className='card-img-top product-image-card' alt={data?.product_name} />
      <div className='card-body'>
        <h5 className='card-title'>{data?.product_name}</h5>
        <p className='card-text'>${data?.price}</p>
        {/* <a href='#' className='btn btn-success' onClick={(event) => event.stopPropagation()}>Agregar al carrito</a> */}
        {/* {userInfo?.role === 'ADMIN' ? <a href='#' className='btn btn-danger' onClick={(event) => event.stopPropagation()}>Eliminar producto</a> : ''} */}
      </div>
    </div>

  )
}

export default ProductCard
