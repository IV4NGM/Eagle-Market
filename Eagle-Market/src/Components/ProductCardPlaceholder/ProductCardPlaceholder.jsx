import ProductDefaultImage from '@/assets/product-default-image.png'
import './ProductCardPlaceholder.scss'

// eslint-disable-next-line react/prop-types
const ProductCardPlaceholder = ({ searchCard = false }) => {
  return (
    <div className={'card product-card ' + (searchCard ? 'placeholder-search-card' : 'placeholder-card')} aria-hidden='true'>
      <div className='card-image-container'>
        <img src={ProductDefaultImage} className='card-img-top product-image-card' alt='Product image' />
      </div>
      <div className='card-body placeholder-body'>
        <h5 className='card-title placeholder-glow'>
          <span className='placeholder col-6' />
        </h5>
        <p className='card-text placeholder-glow'>
          <span className='placeholder col-7' />
          <span className='placeholder col-4' />
          <span className='placeholder col-4' />
          <span className='placeholder col-6' />
          <span className='placeholder col-8' />
        </p>
        <a className='btn btn-success disabled placeholder col-10' aria-disabled='true' />
      </div>
    </div>
  )
}

export default ProductCardPlaceholder
