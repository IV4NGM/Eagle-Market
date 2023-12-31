import './Loader.scss'
import greenLoader from '@/assets/green-loader-slow.gif'
import useProductsContext from '@/Context/ProductsContext/useProductsContext'

// eslint-disable-next-line react/prop-types
const Loader = () => {
  const { apiCall } = useProductsContext()
  return (
    <>
      {!apiCall
        ? (
          <div className='loader-container'>
            <img className='loader-img' src={greenLoader} alt='Loading' />
          </div>
          )
        : ''}
    </>
  )
}

export default Loader
