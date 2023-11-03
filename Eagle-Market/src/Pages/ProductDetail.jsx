import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useAuthContext from '@/Context/AuthContext/useAuthContext'
import useCartContext from '@/Context/CartContext/useCartContext'

const ProductDetail = () => {
  const navigate = useNavigate()

  const { loginStatus, userInfo } = useAuthContext()
  const { id } = useParams()
  const [productDetails, setProductDetails] = useState({})
  const [productAmount, setProductAmount] = useState(1)

  const { cart, setCart, setProductToBuy } = useCartContext()

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
        setProductDetails(result)
      })
      .catch(e => console.log(e))
  }, [id])

  const addToCart = () => {
    if (loginStatus) {
      const newCart = [...cart]
      let changed = false
      for (const item of cart) {
        if (item.id === productDetails.id) {
          item.product_amount += productAmount
          changed = true
          break
        }
      }
      if (!changed) {
        newCart.push({ ...productDetails, product_amount: productAmount })
      }
      console.log(newCart)
      sessionStorage.setItem('cart', JSON.stringify(newCart))
      setCart(newCart)
    } else {
      navigate('/login')
    }
  }

  const buyItem = () => {
    if (loginStatus) {
      setProductToBuy({ ...productDetails, product_amount: productAmount })
      navigate('/checkout')
    } else {
      navigate('/login')
    }
  }

  return (
    <div>
      <h2>{productDetails.product_name}</h2>
      <p>Marca: {productDetails.brand}</p>
      <p>Categoría: {productDetails.category}</p>
      <img src={productDetails.image} alt={productDetails.product_name} />
      <p>Descripción: {productDetails.description}</p>
      <p>Precio: ${productDetails.price}</p>
      <button onClick={() => setProductAmount(Math.max(1, productAmount - 1))}>-</button>
      <input
        type='number'
        value={productAmount}
        onChange={(event) => setProductAmount(Math.max(1, Math.round(event.target.value)))}
      />
      <button onClick={() => setProductAmount(productAmount + 1)}>+</button>
      <button className='btn btn-success' onClick={() => buyItem()}>Comprar ahora</button>
      <button className='btn btn-secondary' onClick={() => addToCart()}>Agregar al carrito</button>
      {userInfo?.role === 'ADMIN' ? <button className='btn btn-danger'>Eliminar producto</button> : ''}
    </div>
  )
}

export default ProductDetail
