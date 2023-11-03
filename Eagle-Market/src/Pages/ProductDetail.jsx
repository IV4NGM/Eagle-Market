import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useAuthContext from '@/Context/AuthContext/useAuthContext'
import buyItem from '@/Hooks/buyItem'
import addToCart from '@/Hooks/addToCart'

const ProductDetail = () => {
  const { userInfo } = useAuthContext()
  const { id } = useParams()
  const [productDeatils, setProductDeatils] = useState({})
  const [productAmount, setProductAmount] = useState(1)

  useEffect(() => {
    console.log('Getting')
    const getProducts = fetch(`https://eagle-market.onrender.com/items/${id}`, {
      method: 'GET'
    })
    getProducts.then((result) => {
      return result.json()
    })
      .then((result) => {
        console.log(result)
        setProductDeatils(result)
      })
      .catch(e => console.log(e))
  }, [id])
  return (
    <div>
      <h2>{productDeatils.product_name}</h2>
      <p>Marca: {productDeatils.brand}</p>
      <p>Categoría: {productDeatils.category}</p>
      <img src={productDeatils.image} alt={productDeatils.product_name} />
      <p>Descripción: {productDeatils.description}</p>
      <p>Precio: ${productDeatils.price}</p>
      <button onClick={() => setProductAmount(Math.max(1, productAmount - 1))}>-</button>
      <input
        type='number'
        value={productAmount}
        onChange={(event) => setProductAmount(Math.max(1, Math.round(event.target.value)))}
      />
      <button onClick={() => setProductAmount(productAmount + 1)}>+</button>
      <button className='btn btn-success' onClick={() => buyItem(id, productAmount)}>Comprar ahora</button>
      <button className='btn btn-secondary' onClick={() => addToCart(id, productAmount)}>Agregar al carrito</button>
      {userInfo?.role === 'ADMIN' ? <button className='btn btn-danger'>Eliminar producto</button> : ''}
    </div>
  )
}

export default ProductDetail
