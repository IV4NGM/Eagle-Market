import useCartContext from '@/Context/CartContext/useCartContext'
import CartProductCard from '@/Components/CartProductCard/CartProductCard'
import CustomModal from '@/Components/CustomModal/CustomModal'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Checkout = () => {
  const navigate = useNavigate()

  const { cart, setCart, productToBuy, setProductToBuy } = useCartContext()

  const [showModalBuyNow, setShowModalBuyNow] = useState(false)
  const [showModalBuyAllCart, setShowModalBuyAllCart] = useState(false)
  const [showModalSuccess, setShowModalSuccess] = useState(false)

  const [showModalDeleteBuy, setShowModalDeleteBuy] = useState(false)
  const [showModalDeleteCartItem, setShowModalDeleteCartItem] = useState(false)
  const [deleteCartParams, setDeleteCartParams] = useState({})

  const comprarAhora = () => {
    setProductToBuy({})
    console.log('Comprado')
    setShowModalBuyNow(false)
    setShowModalSuccess(true)
  }

  const comprarCarrito = () => {
    sessionStorage.setItem('cart', JSON.stringify([]))
    setCart([])
    console.log('Carrito comprado')
    setShowModalBuyAllCart(false)
    setShowModalSuccess(true)
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

  const modifyCart = (newValue, id) => {
    let newArray = [...cart]
    for (const element of newArray) {
      if (element.id === id) {
        element.product_amount = newValue
      }
    }
    newArray = newArray.filter(element => element.product_amount > 0)
    sessionStorage.setItem('cart', JSON.stringify(newArray))
    setCart(newArray)
  }

  const changeValueFunction = (type, newValue, id) => {
    if (type === 'cart') {
      setDeleteCartParams({ newValue, id })
      newValue === 0 ? setShowModalDeleteCartItem(true) : modifyCart(newValue, id)
    } else {
      if (newValue === 0) {
        setShowModalDeleteBuy(true)
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
      <CustomModal
        title='Comprar ahora'
        showModal={showModalBuyNow}
        setShowModal={setShowModalBuyNow}
        text={`¿Estás seguro de que quieres comprar ${productToBuy?.product_amount} artículos con valor de` + '$' + ` ${productToBuy?.product_amount * productToBuy?.price}`}
        onYes={comprarAhora}
      />
      <CustomModal
        title='Comprar carrito'
        showModal={showModalBuyAllCart}
        setShowModal={setShowModalBuyAllCart}
        text={`¿Estás seguro de que quieres comprar ${productsAmount} artículos con valor de` + '$' + ` ${totalPrice}`}
        onYes={comprarAhora}
      />
      <CustomModal
        title='Compra realizada exitosamente'
        showModal={showModalSuccess}
        setShowModal={setShowModalSuccess}
        text='Compra realizada exitosamente. Vuelve al inicio para seguir comprando'
        onYes={() => navigate('/')}
        onNo={() => navigate('/')}
        isCancelButton={false}
        textYes='Volver a Inicio'
        estatico
      />
      <CustomModal
        title='Eliminar el producto'
        showModal={showModalDeleteBuy}
        setShowModal={setShowModalDeleteBuy}
        text='¿Estás seguro de que quieres eliminar el producto?'
        onYes={() => setProductToBuy({})}
      />
      <CustomModal
        title='Eliminar el producto'
        showModal={showModalDeleteCartItem}
        setShowModal={setShowModalDeleteCartItem}
        text='¿Estás seguro de que quieres eliminar el producto?'
        onYes={() => modifyCart(deleteCartParams.newValue, deleteCartParams.id)}
      />
      {Object.keys(productToBuy).length > 0
        ? <> <h2>Comprar ahora</h2> <CartProductCard data={productToBuy} changeValueFunction={changeValueFunction} type='productToBuy' onDelete={() => setShowModalDeleteBuy(true)} /> <button onClick={comprarAhora}>Comprar ahora</button> <button onClick={addToCart}>Agregar al carrito</button> </>
        : ''}
      <h3>Carrito</h3>
      {cart.map((element, index) => {
        return (
          <CartProductCard
            data={element} changeValueFunction={changeValueFunction} key={index} type='cart' onDelete={() => {
              setDeleteCartParams({ newValue: 0, id: element.id })
              setShowModalDeleteCartItem(true)
            }}
          />
        )
      })}
      <p>Cantidad de productos: {productsAmount}</p>
      <p><strong>Gran total: ${totalPrice}</strong></p>
      <button onClick={comprarCarrito}>Comprar carrito</button>
    </>
  )
}

export default Checkout
