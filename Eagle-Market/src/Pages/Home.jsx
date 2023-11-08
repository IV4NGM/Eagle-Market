import useAuthContext from '@/Context/AuthContext/useAuthContext'
import ProductCard from '@/Components/ProductCard/ProductCard'
import { useEffect, useState } from 'react'
import useProductsContext from '@/Context/ProductsContext/useProductsContext'
import { useNavigate, Link } from 'react-router-dom'
import ProductCardPlaceholder from '@/Components/ProductCardPlaceholder/ProductCardPlaceholder'
import CustomModal from '@/Components/CustomModal/CustomModal'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'

const Home = () => {
  const { userInfo } = useAuthContext()
  const navigate = useNavigate()

  const [loaded, setLoaded] = useState(false)
  const [showModalFailure, setShowModalFailure] = useState(false)

  const { products, setProducts } = useProductsContext()

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
    window.scrollTo(0, 0)
  }, [setProducts])

  const categoriesArray = []
  for (const element of products) {
    if (!categoriesArray.includes(element.category)) {
      categoriesArray.push(element.category)
    }
  }
  categoriesArray.sort()
  console.log(categoriesArray)
  const responsiveCarousel = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  }
  return (
    <>
      <div>Bienvenido {userInfo.first_name}</div>
      {/* <button onClick={() => window.location.reload(false)}>Recargar</button> */}
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
        {userInfo?.role === 'ADMIN' ? <div className='card' style={{ width: '18rem' }} onClick={() => navigate('/new-product')}> + </div> : ''}
        {!loaded ? <> <ProductCardPlaceholder /> <ProductCardPlaceholder /> <ProductCardPlaceholder /> </> : ''}
        {/* {productsArray.map((element, index) => {
          return <ProductCard data={element} key={index} />
        })} */}
      </div>
      {
        categoriesArray.map((category, index) => {
          return (
            <div key={`div-${index}`}>
              <Link key={`link-${index}`} to={`/search/${category}`}>
                <h4 key={`h4-${index}`}>{category}</h4>
              </Link>
              <Carousel key={`carousel-${index}`} responsive={responsiveCarousel}>
                {(products.filter((product) => product.category === category)).map((element, index) => {
                  return <ProductCard data={element} key={`card-${index}`} />
                })}
              </Carousel>
            </div>
          )
        })
      }
    </>
  )
}

export default Home
