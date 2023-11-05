import './Loader.scss'
import loader from '@/assets/loader.gif'
import useProductsContext from '@/Context/ProductsContext/useProductsContext'

// eslint-disable-next-line react/prop-types
const Loader = () => {
  const { apiCall } = useProductsContext()
  return (
    <>
      {!apiCall
        ? <div className='loader-container'>
          {/* <p>Cargando contenido...</p> */}
          <img className='loader-img' src={loader} alt='Loading' />
          </div>
        : ''}

    </>
  )
}

export default Loader
