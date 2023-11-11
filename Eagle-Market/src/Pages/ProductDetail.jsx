import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useAuthContext from '@/Context/AuthContext/useAuthContext'
import useCartContext from '@/Context/CartContext/useCartContext'
import useProductsContext from '@/Context/ProductsContext/useProductsContext'
import CustomModal from '@/Components/CustomModal/CustomModal'

const ProductDetail = () => {
  const navigate = useNavigate()

  const { token, loginStatus, userInfo } = useAuthContext()
  const { id } = useParams()
  const [productDetails, setProductDetails] = useState({})
  const [productAmount, setProductAmount] = useState(1)
  const [deleteProduct, setDeleteProduct] = useState(false)

  const [showModalDelete, setShowModalDelete] = useState(false)
  const [showModalFailure, setShowModalFailure] = useState(false)
  const [showModalSuccess, setShowModalSuccess] = useState(false)

  const [addedToCart, setAddedToCart] = useState(false)

  const { cart, setCart, productToBuy, setProductToBuy } = useCartContext()
  const { setNavSearch, setApiCall } = useProductsContext()

  useEffect(() => {
    if (!showModalSuccess) {
      console.log('Getting')
      // setApiCall(false)
      const getProducts = fetch(`https://eagle-market.onrender.com/items/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      getProducts.then((result) => {
        return result.json()
      })
        .then((result) => {
          // setApiCall(true)
          console.log(result)
          setProductDetails(result)
        })
        .catch(e => {
          console.log(e)
          // setApiCall(true)
        })
    }
    if (deleteProduct) {
      setDeleteProduct(false)
      const cleanBuyCart = () => {
        if (productToBuy?.id === id) {
          setProductToBuy({})
        }
      }
      const cleanCart = () => {
        let newCart = [...cart]
        newCart = newCart.filter((element) => element.id !== id)
        sessionStorage.setItem('cart', JSON.stringify(newCart))
        setCart(newCart)
      }
      setApiCall(false)
      const deleteProduct = fetch('https://eagle-market.onrender.com/remove', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          id
        })
      })

      deleteProduct.then((value) => {
        console.log(value)
        if (value.ok) {
          return value.json()
        } else {
          throw new Error('No está permitido')
        }
      })
        .then((value) => {
          console.log(value)
          setApiCall(true)
          cleanBuyCart()
          cleanCart()
          setShowModalSuccess(true)
        })
        .catch((e) => {
          console.log(e)
          setApiCall(true)
          setShowModalFailure(true)
        })
    }
  }, [cart, deleteProduct, id, productToBuy, setApiCall, setCart, setProductToBuy, showModalSuccess, token])

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
      setAddedToCart(true)
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
    <>
      {!showModalSuccess
        ? <div>
          <h2>{productDetails.product_name}</h2>
          <p>Marca: {productDetails.brand}</p>
          <p>Categoría: {productDetails.category}</p>
          <img src={productDetails?.image || productDetails?.base64Image} alt={productDetails.product_name} />
          <p>Descripción del producto:</p>
          <div className='display-linebreak'>
            {productDetails.description}
          </div>
          <p>Precio: ${productDetails.price}</p>
          <button onClick={() => setProductAmount(Math.max(1, productAmount - 1))}>-</button>
          <p style={{ display: 'inline' }}>{productAmount}</p>
          <button onClick={() => setProductAmount(productAmount + 1)}>+</button>
          <button className='btn btn-success' onClick={() => buyItem()}>Comprar ahora</button>
          <button className='btn btn-secondary' onClick={() => addToCart()}>Agregar al carrito</button>
          {userInfo?.role === 'ADMIN' ? <button className='btn btn-danger' onClick={() => setShowModalDelete(true)}>Eliminar producto</button> : ''}
          {userInfo?.role === 'ADMIN' ? <button className='btn btn-primary' onClick={() => navigate(`/edit/${productDetails.id}`)}>Editar producto</button> : ''}
          </div>
        : ''}
      <CustomModal
        title='Eliminar producto'
        showModal={showModalDelete}
        setShowModal={setShowModalDelete}
        text='¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer'
        onYes={() => setDeleteProduct(true)}
      />
      <CustomModal
        title='Error al eliminar'
        showModal={showModalFailure}
        setShowModal={setShowModalFailure}
        text='Hubo un error al eliminar el producto. Intente de nuevo más tarde'
        isCancelButton={false}
        textYes='Regresar'
        estatico
      />
      <CustomModal
        title='Producto eliminado exitosamente'
        showModal={showModalSuccess}
        setShowModal={setShowModalSuccess}
        text='Producto eliminado exitosamente. Vuelve al inicio para seguir comprando'
        onYes={() => {
          setNavSearch('')
          navigate('/')
        }}
        onNo={() => {
          setNavSearch('')
          navigate(-1)
        }}
        textYes='Volver a Inicio'
        textNo='Atrás'
        estatico
      />
      <CustomModal
        title='Producto agregado al carrito'
        showModal={addedToCart}
        setShowModal={setAddedToCart}
        text='Producto agregado al carrito exitosamente.'
        onYes={() => {
          setNavSearch('')
          navigate('/checkout')
        }}
        textYes='Ver carrito'
        textNo='Seguir comprando'
      />
    </>
  )
}

export default ProductDetail
