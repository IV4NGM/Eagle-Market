/* eslint-disable react/prop-types */
import ProductCard from '@/Components/ProductCard/ProductCard'
import ProductCardPlaceholder from '@/Components/ProductCardPlaceholder/ProductCardPlaceholder'
import './SearchCardsContainer.scss'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'

const SearchCardsContainer = ({ products, loaded, search, selectedCategories, allCategories, prices, categoriesArray }) => {
  const productsArray = products.filter((item) => {
    const textMatch = item.product_name.toLocaleLowerCase().trim().includes(search.toLocaleLowerCase().trim()) || item.brand.toLocaleLowerCase().trim().includes(search.toLocaleLowerCase().trim()) || item.category.toLocaleLowerCase().trim().includes(search.toLocaleLowerCase().trim())
    let categoriesMatch = true
    let pricesMatch = true
    if (!allCategories) {
      categoriesMatch = textMatch && selectedCategories.includes(item.category)
    } else {
      categoriesMatch = textMatch
    }
    if (prices[1] === 1000) {
      pricesMatch = item.price >= prices[0]
    } else {
      pricesMatch = (item.price >= prices[0]) && (item.price <= prices[1])
    }
    return categoriesMatch && pricesMatch
  })

  return (
    <>
      <div className='search-cards-container'>
        {!loaded ? <> <ProductCardPlaceholder /> <ProductCardPlaceholder /> <ProductCardPlaceholder /> </> : ''}
        {productsArray.length > 0
          ? productsArray.map((element, index) => {
            return <ProductCard data={element} key={index} />
          })
          : ''}
      </div>
      <div>
        {!loaded || productsArray.length > 0
          ? ''
          : (
            <>
              <SearchOutlinedIcon className='not-found-image' />
              <h5>No hay productos que coincidan con tus criterios de búsqueda.</h5>
              <h5>Intenta nuevamente con otros parámetros.</h5>
            </>
            )}
      </div>
    </>
  )
}

export default SearchCardsContainer
