import useAuthContext from '@/Context/AuthContext/useAuthContext'
import ProductCard from '@/Components/ProductCard/ProductCard'
import { useEffect, useState } from 'react'
import useProductsContext from '@/Context/ProductsContext/useProductsContext'
import { useNavigate, Link } from 'react-router-dom'
import ProductCardPlaceholder from '@/Components/ProductCardPlaceholder/ProductCardPlaceholder'
import CustomModal from '@/Components/CustomModal/CustomModal'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'
import ItemsCarousel from 'react-items-carousel'
import '@/Styles/Home.scss'
import EagleMarketMainPage from '@/assets/EagleMarket-main-page.jpg'
import KeyboardDoubleArrowRightOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowRightOutlined'

const Home = () => {
  const { loginStatus, userInfo } = useAuthContext()
  const navigate = useNavigate()

  const [loaded, setLoaded] = useState(false)
  const [showModalFailure, setShowModalFailure] = useState(false)

  const { products, setProducts } = useProductsContext()

  // Para ItemsCarousel
  const [activeItemIndex, setActiveItemIndex] = useState(0)
  const chevronWidth = 40

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
  // const categoriesArray = ['Automotive', 'Baby', 'Beauty', 'Books', 'Clothing', 'Computers', 'Electronics',
  //   'Games', 'Garden', 'Grocery', 'Health', 'Home', 'Industrial', 'Jewerly', 'Kids', 'Movies', 'Music',
  //   'Outdoors', 'Sports', 'Tools', 'Toys', 'Other']

  const responsiveCarousel = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
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
      // the naming can be any, depends on you.
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
      breakpoint: { max: 1024, min: 464 },
      items: 4,
      slidesToSlide: 2
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
            return <div className='carousel-categories-div' key={`category-div-${index}`}><Link key={`category-link-${index}`} to={`/search/${element}`}>{element}</Link></div>
          })}
        </Carousel>
      </div>
      <h5 className='text-underlined home-title--spaced'><Link to='/search' className='text-black'>Consulta nuestro catálogo <KeyboardDoubleArrowRightOutlinedIcon /></Link></h5>

      <div className='flex-wrap'>
        {/* {userInfo?.role === 'ADMIN' ? <div className='card' style={{ width: '18rem' }} onClick={() => navigate('/new-product')}> + </div> : ''} */}
        {!loaded ? <div className='placeholder-container'> <ProductCardPlaceholder /> <ProductCardPlaceholder /> <ProductCardPlaceholder /> </div> : ''}
        {/* {productsArray.map((element, index) => {
          return <ProductCard data={element} key={index} />
        })} */}
      </div>
      {
        categoriesArray.map((category, index) => {
          return (
            <div key={`main-container-${index}`} className='main-container'>
              {/* <div className='straight-line' /> */}
              <div key={`div-${index}`} className='carousel-container card'>
                <Link key={`link-${index}`} to={`/search/${category}`}>
                  <h2 key={`h2-${index}`}><strong>{category}</strong></h2>
                </Link>
                <Carousel key={`carousel-${index}`} responsive={responsiveCarousel}>
                  {(products.filter((product) => product.category === category)).map((element, index) => {
                    return <ProductCard data={element} key={`card-${index}`} />
                  })}
                </Carousel>
              </div>
            </div>
          )
        })
      }
      {/* {
        categoriesArray.map((category, index) => {
          return (
            <div key={`div-${index}`} className='carousel-container'>
              <Link key={`link-${index}`} to={`/search/${category}`}>
                <h4 key={`h4-${index}`}>{category}</h4>
              </Link>
              <div style={{ padding: `0 ${chevronWidth}px` }}>
                <ItemsCarousel
                  placeholderItem={<div style={{ height: 200, background: '#EEE' }} />}
                  enablePlaceholder
                  numberOfPlaceholderItems={4}
                  requestToChangeActive={setActiveItemIndex}
                  activeItemIndex={activeItemIndex}
                  numberOfCards={4}
                  gutter={20}
                  leftChevron={<button>{'<'}</button>}
                  rightChevron={<button>{'>'}</button>}
                  outsideChevron
                  chevronWidth={chevronWidth}
                >
                  {!loaded
                    ? []
                    : (products.filter((product) => product.category === category)).map((element, index) => {
                        return <ProductCard data={element} key={`card-${index}`} />
                      })}
                </ItemsCarousel>
              </div>
            </div>
          )
        })
      } */}
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
