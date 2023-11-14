import useAuthContext from '@/Context/AuthContext/useAuthContext'
import ProductCard from '@/Components/ProductCard/ProductCard'
import { useEffect, useState } from 'react'
import useProductsContext from '@/Context/ProductsContext/useProductsContext'
import { Link } from 'react-router-dom'
import ProductCardPlaceholder from '@/Components/ProductCardPlaceholder/ProductCardPlaceholder'
import CustomModal from '@/Components/CustomModal/CustomModal'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'
import '@/Styles/Home.scss'
import EagleMarketMainPage from '@/assets/EagleMarket-main-page.jpg'
import KeyboardDoubleArrowRightOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowRightOutlined'

const Home = () => {
  const { loginStatus, userInfo } = useAuthContext()

  const [loaded, setLoaded] = useState(false)
  const [showModalFailure, setShowModalFailure] = useState(false)

  const { products, setProducts, setAdvancedSearch } = useProductsContext()

  useEffect(() => {
    const getProducts = fetch('https://eagle-market.onrender.com/items', {
      method: 'GET'
    })
    getProducts.then((result) => {
      return result.json()
    })
      .then((result) => {
        setLoaded(true)
        setProducts(result)
      })
      .catch(e => {
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

  const topCategories = categoriesArray.filter(category => (products.filter((product) => product.category === category))?.length >= 7)
  topCategories.sort((a, b) => {
    return (products.filter((product) => product.category === b))?.length - (products.filter((product) => product.category === a))?.length
  })

  const responsiveCarousel = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 8
    },
    desktop: {
      breakpoint: { max: 3000, min: 1360 },
      items: 4
    },
    tablet: {
      breakpoint: { max: 1360, min: 670 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 670, min: 0 },
      items: 1
    }
  }

  const responsiveCategoriesCarousel = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 8,
      slidesToSlide: 4
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 6,
      slidesToSlide: 3
    },
    tablet: {
      breakpoint: { max: 1024, min: 670 },
      items: 4,
      slidesToSlide: 2
    },
    minitablet: {
      breakpoint: { max: 670, min: 464 },
      items: 3
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 2
    }
  }
  return (
    <div className='page-container'>
      <h2 className='home-title'>¡Hola{loginStatus ? ' ' + userInfo.first_name.toString() : ''}!</h2>
      <h3 className='home-title'>¡Encuentra miles de productos en Eagle Market!</h3>
      <img className='main-image' src={EagleMarketMainPage} alt='Eagle Market' />
      <h3 className='home-title'><i>Donde la elegancia se encuentra con la excelencia</i></h3>
      <h2 className='home-title home-title--spaced'>Explora todas nuestras categorías</h2>
      <div className='categories-container'>
        <Carousel responsive={responsiveCategoriesCarousel} infinite autoPlay autoPlaySpeed={4000}>
          {categoriesArray.map((element, index) => {
            return <div className='carousel-categories-div' key={`category-div-${index}`}><Link key={`category-link-${index}`} to={`/search/${element}`} onClick={() => setAdvancedSearch('')}>{element}</Link></div>
          })}
        </Carousel>
      </div>
      <h5 className='text-underlined home-title--spaced'><Link to='/search' className='text-black'>Consulta nuestro catálogo <KeyboardDoubleArrowRightOutlinedIcon /></Link></h5>

      <div className='flex-wrap'>
        {!loaded ? <div className='placeholder-container'> <ProductCardPlaceholder /> <ProductCardPlaceholder /> <ProductCardPlaceholder /> </div> : ''}
      </div>
      {loaded ? <h2 className='spaced'><strong>Nuestras categorías más famosas</strong></h2> : ''}
      {
        topCategories.map((category, index) => {
          return (
            <div key={`top-div-${index}`} className='carousel-container card'>
              <Link key={`top-link-${index}`} to={`/search/${category}`} onClick={() => setAdvancedSearch('')}>
                <h2 className='spaced' key={`top-h2-${index}`}><strong>{category}</strong></h2>
              </Link>
              <Carousel key={`top-carousel-${index}`} responsive={responsiveCarousel}>
                {(products.filter((product) => product.category === category)).map((element, index) => {
                  return <ProductCard data={element} key={`card-${index}`} />
                })}
              </Carousel>
            </div>
          )
        })
      }
      {loaded ? <h2 className='spaced'><strong>Todos nuestros productos</strong></h2> : ''}
      {
        categoriesArray.map((category, index) => {
          return (
            <div key={`div-${index}`} className='carousel-container card'>
              <Link key={`link-${index}`} to={`/search/${category}`} onClick={() => setAdvancedSearch('')}>
                <h2 className='spaced' key={`h2-${index}`}><strong>{category}</strong></h2>
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
      <CustomModal
        title='Error al cargar los productos'
        showModal={showModalFailure}
        setShowModal={setShowModalFailure}
        text='Hubo un error al intentar cargar los productos. Recarga la página para volver a intentarlo o vuelve más tarde'
        isCancelButton={false}
        textYes='Regresar'
        estatico
      />
    </div>
  )
}

export default Home
