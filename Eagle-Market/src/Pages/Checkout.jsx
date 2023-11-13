import useCartContext from '@/Context/CartContext/useCartContext'
import CartProductCard from '@/Components/CartProductCard/CartProductCard'
import CustomModal from '@/Components/CustomModal/CustomModal'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useProductsContext from '@/Context/ProductsContext/useProductsContext'
import useAuthContext from '@/Context/AuthContext/useAuthContext'
import NoLoggedRedirect from '@/Context/AuthContext/NoLoggedRedirect'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'

const Checkout = () => {
  const navigate = useNavigate()

  const { token } = useAuthContext()
  const { cart, setCart, productToBuy, setProductToBuy } = useCartContext()
  const { setNavSearch, setApiCall } = useProductsContext()

  const [showModalBuyNow, setShowModalBuyNow] = useState(false)
  const [showModalBuyAllCart, setShowModalBuyAllCart] = useState(false)
  const [showModalSuccess, setShowModalSuccess] = useState(false)

  const [showModalDeleteBuy, setShowModalDeleteBuy] = useState(false)
  const [showModalDeleteCartItem, setShowModalDeleteCartItem] = useState(false)
  const [deleteCartParams, setDeleteCartParams] = useState({})

  const [buyNow, setBuyNow] = useState(false)
  const [buyAllCart, setBuyAllCart] = useState(false)
  const [showModalFailure, setShowModalFailure] = useState(false)

  useEffect(() => {
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

    const productsToBuy = []

    if (buyNow) {
      productsToBuy.push(productToBuy)
    }

    if (buyAllCart) {
      for (const element of cart) {
        productsToBuy.push(element)
      }
    }

    if (buyNow || buyAllCart) {
      let productsAmount = 0
      let totalPrice = 0
      const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' }
      const localOrderDate = new Date().toLocaleDateString('es-ES', dateOptions)
      const localOrderTime = new Date().toLocaleTimeString()
      if (buyNow) {
        productsAmount = productToBuy.product_amount
        totalPrice = productToBuy?.product_amount * productToBuy?.price
      } else if (buyAllCart) {
        for (const item of cart) {
          productsAmount += item.product_amount
          totalPrice += item.price * item.product_amount
        }
      }
      setApiCall(false)
      const buy = fetch('https://eagle-market.onrender.com/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          products: productsToBuy,
          products_amount: productsAmount,
          total_price: totalPrice,
          localOrderDate,
          localOrderTime
        })
      })

      buy.then((value) => {
        console.log(value)
        setApiCall(true)
        return value.json()
      })
        .then((value) => {
          console.log(value)
          if (buyNow) {
            comprarAhora()
            setBuyNow(false)
          }
          if (buyAllCart) {
            comprarCarrito()
            setBuyAllCart(false)
          }
        })
        .catch((e) => {
          console.log(e)
          setApiCall(true)
          setBuyNow(false)
          setBuyAllCart(false)
          setShowModalFailure(true)
        })
    }
    window.scrollTo(0, 0)
  }, [buyAllCart, buyNow, cart, productToBuy, setApiCall, setCart, setProductToBuy, token])

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
    <div className='page-container'>
      <NoLoggedRedirect />
      {Object.keys(productToBuy).length > 0
        ? <>
          <h2>Comprar ahora</h2>
          <div className='flex-row cart-flex'>
            <div className='cart-flex-left'>
              <CartProductCard data={productToBuy} changeValueFunction={changeValueFunction} type='productToBuy' onDelete={() => setShowModalDeleteBuy(true)} />
            </div>
            <div className='cart-flex-right'>
              <div className='card cart-checkout-details'>
                <h4>Detalles de la compra</h4>
                <div className='cart-details-grid spaced'>
                  <p>Cantidad de productos:</p>
                  <p className='right'>{productToBuy?.product_amount}</p>
                  <p><strong>Gran total: </strong></p>
                  <p className='right'><strong>$ {productToBuy?.price * productToBuy?.product_amount}</strong></p>
                </div>
                <div className='flex-column'>
                  <button className='btn btn-success btn-spaced' onClick={() => setShowModalBuyNow(true)}>Comprar ahora</button>
                  <button className='btn btn-secondary' onClick={addToCart}>Agregar al carrito</button>
                </div>
              </div>
            </div>
          </div>
          </>
        : ''}
      <h2 className='spaced'>Mi carrito</h2>
      {!token || cart.length > 0
        ? <div className='flex-row cart-flex'>
          <div className='cart-flex-left'>
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
          </div>
          <div className='cart-flex-right'>
            <div className='card cart-checkout-details'>
              <h4>Detalles de la compra</h4>
              <div className='cart-details-grid spaced'>
                <p>Cantidad de productos:</p>
                <p className='right'>{productsAmount}</p>
                <p><strong>Gran total: </strong></p>
                <p className='right'><strong>$ {totalPrice}</strong></p>
              </div>
              {cart.length > 0 ? <button className='btn btn-success' onClick={() => setShowModalBuyAllCart(true)}>Comprar carrito</button> : ''}
            </div>
          </div>
        </div>
        : <>
          <SearchOutlinedIcon className='not-found-image' />
          <h4>Todavía no hay productos en tu carrito</h4>
          <h4>Vuelve al inicio para seguir comprando</h4>
          <button className='btn btn-success btn-lg spaced' onClick={() => navigate('/')}>Ir a Inicio</button>
        </>}
      <CustomModal
        title='Comprar ahora'
        showModal={showModalBuyNow}
        setShowModal={setShowModalBuyNow}
        text={`¿Confirmas la compra de ${productToBuy?.product_amount} artículos con valor de` + ' $' + `${productToBuy?.product_amount * productToBuy?.price}?`}
        onYes={() => setBuyNow(true)}
        textYes='Comprar ahora'
        textNo='Cancelar'
      />
      <CustomModal
        title='Comprar carrito'
        showModal={showModalBuyAllCart}
        setShowModal={setShowModalBuyAllCart}
        text={`¿Confirmas la compra de ${productsAmount} artículos con valor de` + ' $' + `${totalPrice}?`}
        onYes={() => setBuyAllCart(true)}
        textYes='Comprar ahora'
        textNo='Cancelar'
      />
      <CustomModal
        title='Compra realizada exitosamente'
        showModal={showModalSuccess}
        setShowModal={setShowModalSuccess}
        text='Compra realizada exitosamente. Vuelve al inicio para seguir comprando'
        onYes={() => {
          setNavSearch('')
          navigate('/')
        }}
        textYes='Volver a Inicio'
        textNo='Ver carrito'
      />
      <CustomModal
        title='Error al comprar productos'
        showModal={showModalFailure}
        setShowModal={setShowModalFailure}
        text='Hubo un error al intentar comprar los productos. Intente de nuevo más tarde'
        isCancelButton={false}
        textYes='Regresar'
        estatico
      />
      <CustomModal
        title='Eliminar el producto'
        showModal={showModalDeleteBuy}
        setShowModal={setShowModalDeleteBuy}
        text='¿Estás seguro de que quieres eliminar el producto?'
        onYes={() => setProductToBuy({})}
        textYes='Eliminar producto'
        textNo='Cancelar'
      />
      <CustomModal
        title='Eliminar el producto'
        showModal={showModalDeleteCartItem}
        setShowModal={setShowModalDeleteCartItem}
        text='¿Estás seguro de que quieres eliminar el producto?'
        onYes={() => modifyCart(deleteCartParams.newValue, deleteCartParams.id)}
        textYes='Eliminar producto'
        textNo='Cancelar'
      />
    </div>
  )
}

export default Checkout
