import useCartContext from '@/Context/CartContext/useCartContext'
import CartProductCard from '@/Components/CartProductCard/CartProductCard'

const Checkout = () => {
  const { cart, setCart, productToBuy, setProductToBuy } = useCartContext()

  const comprarAhora = () => {
    setProductToBuy({})
    console.log('Comprado')
  }

  const comprarCarrito = () => {
    sessionStorage.setItem('cart', JSON.stringify([]))
    setCart([])
    console.log('Carrito comprado')
  }

  const addToCart = () => {
    const newCart = [...cart]
    let changed = false
    for (const item of cart) {
      if (item.id === productToBuy.id) {
        item.product_amount += productToBuy.product_amount
        changed = true
        break
      }
    }
    if (!changed) {
      newCart.push({ ...productToBuy })
    }
    console.log(newCart)
    sessionStorage.setItem('cart', JSON.stringify(newCart))
    setProductToBuy({})
    setCart(newCart)
  }

  const changeValueFunction = (type, newValue, id) => {
    if (type === 'cart') {
      let newArray = [...cart]
      for (const element of newArray) {
        if (element.id === id) {
          element.product_amount = newValue
        }
      }
      newArray = newArray.filter(element => element.product_amount > 0)
      sessionStorage.setItem('cart', JSON.stringify(newArray))
      setCart(newArray)
    } else {
      if (newValue === 0) {
        setProductToBuy({})
      } else {
        const newProduct = { ...productToBuy }
        newProduct.product_amount = newValue
        setProductToBuy(newProduct)
      }
    }
  }

  let productsAmount = 0
  let totalPrice = 0
  for (const item of cart) {
    productsAmount += item.product_amount
    totalPrice += item.price * item.product_amount
  }

  return (
    <>
      {Object.keys(productToBuy).length > 0
        ? <> <h2>Comprar ahora</h2> <CartProductCard data={productToBuy} changeValueFunction={changeValueFunction} type='productToBuy' /> <button onClick={comprarAhora}>Comprar ahora</button> <button onClick={addToCart}>Agregar al carrito</button> </>
        : ''}
      <h3>Carrito</h3>
      {cart.map((element, index) => {
        return <CartProductCard data={element} changeValueFunction={changeValueFunction} key={index} type='cart' />
      })}
      <p>Cantidad de productos: {productsAmount}</p>
      <p><strong>Gran total: ${totalPrice}</strong></p>
      <button onClick={comprarCarrito}>Comprar carrito</button>
    </>
  )
}

export default Checkout
