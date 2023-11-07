import ProductCard from '@/Components/ProductCard/ProductCard'
import { useEffect, useState } from 'react'
import useProductsContext from '@/Context/ProductsContext/useProductsContext'
import { useNavigate } from 'react-router-dom'
import ProductCardPlaceholder from '@/Components/ProductCardPlaceholder/ProductCardPlaceholder'
import CustomModal from '@/Components/CustomModal/CustomModal'

// eslint-disable-next-line react/prop-types
const CardsContainer = ({ isAdmin }) => {
  const navigate = useNavigate()

  const [loaded, setLoaded] = useState(false)
  const [showModalFailure, setShowModalFailure] = useState(false)

  const { products, setProducts, navSearch } = useProductsContext()

  useEffect(() => {
    console.log('Getting')
    const getProducts = fetch('https://eagle-market.onrender.com/items', {
      method: 'GET'
    })
    getProducts.then((result) => {
      return result.json()
    })
      .then((result) => {
        console.log(result)
        setLoaded(true)
        setProducts(result)
      })
      .catch(e => {
        console.log(e)
        setShowModalFailure(true)
      })
  }, [setProducts])

  const productsArray = products.filter((item) => item.product_name.toLocaleLowerCase().trim().includes(navSearch.toLocaleLowerCase().trim()))

  return (
    <>
      <CustomModal
        title='Error al cargar los productos'
        showModal={showModalFailure}
        setShowModal={setShowModalFailure}
        text='Hubo un error al intentar cargar los productos. Recargue la página para volver a intentarlo o vuelva más tarde'
        isCancelButton={false}
        textYes='Regresar'
        estatico
      />
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {isAdmin ? <div className='card' style={{ width: '18rem' }} onClick={() => navigate('/new-product')}> + </div> : ''}
        {!loaded ? <> <ProductCardPlaceholder /> <ProductCardPlaceholder /> <ProductCardPlaceholder /> </> : ''}
        {productsArray.map((element, index) => {
          return <ProductCard data={element} key={index} />
        })}
      </div>
    </>
  )
}

export default CardsContainer
