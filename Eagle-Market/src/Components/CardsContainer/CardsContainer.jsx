import ProductCard from '@/Components/ProductCard/ProductCard'
import { useEffect, useState } from 'react'
import useProductsContext from '@/Context/ProductsContext/useProductsContext'

const CardsContainer = () => {
  const [products, setProducts] = useState([])

  const { navSearch } = useProductsContext()

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
        setProducts(result)
      })
      .catch(e => console.log(e))
  }, [])

  const productsArray = products.filter((item) => item.product_name.toLocaleLowerCase().trim().includes(navSearch.toLocaleLowerCase().trim()))

  return (
    <>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {productsArray.map((element, index) => {
          return <ProductCard data={element} key={index} />
        })}
      </div>
    </>
  )
}

export default CardsContainer
