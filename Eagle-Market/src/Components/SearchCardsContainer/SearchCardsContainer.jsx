/* eslint-disable react/prop-types */
import ProductCard from '@/Components/ProductCard/ProductCard'
import ProductCardPlaceholder from '@/Components/ProductCardPlaceholder/ProductCardPlaceholder'

const SearchCardsContainer = ({ products, loaded, search, selectedCategories, allCategories, prices }) => {
  const productsArray = products.filter((item) => {
    let categoriesMatch = true
    let pricesMatch = true
    if (!allCategories) {
      categoriesMatch = item.product_name.toLocaleLowerCase().trim().includes(search.toLocaleLowerCase().trim()) && selectedCategories.includes(item.category)
    } else {
      categoriesMatch = item.product_name.toLocaleLowerCase().trim().includes(search.toLocaleLowerCase().trim())
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
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {!loaded ? <> <ProductCardPlaceholder /> <ProductCardPlaceholder /> <ProductCardPlaceholder /> </> : ''}
        {productsArray.map((element, index) => {
          return <ProductCard data={element} key={index} />
        })}
      </div>
    </>
  )
}

export default SearchCardsContainer
