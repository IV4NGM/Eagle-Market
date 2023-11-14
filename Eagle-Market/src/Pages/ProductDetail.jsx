import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useAuthContext from '@/Context/AuthContext/useAuthContext'
import useCartContext from '@/Context/CartContext/useCartContext'
import useProductsContext from '@/Context/ProductsContext/useProductsContext'
import CustomModal from '@/Components/CustomModal/CustomModal'
import ProductDefaultImage from '@/assets/product-default-image.png'
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'

const ProductDetail = () => {
  const navigate = useNavigate()

  const { token, loginStatus, userInfo } = useAuthContext()
  const { id } = useParams()
  const [productDetails, setProductDetails] = useState({})
  const [productAmount, setProductAmount] = useState(1)
  const [deleteProduct, setDeleteProduct] = useState(false)

  const [showModalNoProductData, setShowModalNoProductData] = useState(false)
  const [showModalDelete, setShowModalDelete] = useState(false)
  const [showModalFailure, setShowModalFailure] = useState(false)
  const [showModalSuccess, setShowModalSuccess] = useState(false)

  const [addedToCart, setAddedToCart] = useState(false)

  const { cart, setCart, productToBuy, setProductToBuy } = useCartContext()
  const { setNavSearch, setApiCall } = useProductsContext()

  useEffect(() => {
    if (!showModalSuccess && !deleteProduct) {
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
          if (Object.keys(result).length > 0) {
            setProductDetails(result)
          } else {
            setShowModalNoProductData(true)
          }
        })
        .catch(e => {
          setShowModalNoProductData(true)
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
        localStorage.setItem('cart', JSON.stringify(newCart))
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
        if (value.ok) {
          return value.json()
        } else {
          throw new Error('No está permitido')
        }
      })
        .then((value) => {
          setApiCall(true)
          cleanBuyCart()
          cleanCart()
          setShowModalSuccess(true)
        })
        .catch((e) => {
          setApiCall(true)
          setShowModalFailure(true)
        })
    }
    window.scrollTo(0, 0)
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
      localStorage.setItem('cart', JSON.stringify(newCart))
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
    <div className='page-container'>
      {!showModalSuccess
        ? (
          <div className='flex-row cart-flex'>
            <div className='cart-flex-left details-card-container'>
              <div className='card details-card'>
                <div className='flex-column details-container'>
                  <div className='separated-section'>
                    <h2>{productDetails.product_name}</h2>
                  </div>
                  <div className='separated-section separated-section--border'>
                    <img
                      src={productDetails?.image || productDetails?.base64Image || ProductDefaultImage} alt={productDetails.product_name} className='product-details-image spaced' onError={({ currentTarget }) => {
                        currentTarget.onerror = null
                        currentTarget.src = ProductDefaultImage
                      }}
                    />
                  </div>
                  <div className='separated-section separated-section--border'>
                    <h4 className='spaced'>Características del producto</h4>
                    <table className='table'>
                      <thead>
                        <tr>
                          <th scope='col' />
                          <th scope='col' />
                        </tr>
                      </thead>
                      <tbody>
                        <tr className='table-success'>
                          <th scope='row'>Marca</th>
                          <td>{productDetails.brand}</td>
                        </tr>
                        <tr className='table-light'>
                          <th scope='row'>Categoría</th>
                          <td>{productDetails.category}</td>
                        </tr>
                        {productDetails.sku
                          ? (
                            <tr className='table-success'>
                              <th scope='row'>SKU</th>
                              <td>{productDetails.sku}</td>
                            </tr>
                            )
                          : ''}
                      </tbody>
                    </table>
                  </div>
                  <div className='separated-section'>
                    <h4 className='spaced'>Descripción del producto</h4>
                    <div className='display-linebreak spaced product-description'>
                      {productDetails.description}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='cart-flex-right'>
              <div className='card product-detail-card flex-column'>
                <h4>{productDetails.product_name}</h4>
                <h4 className='card-text__success-color spaced'>${productDetails.price}</h4>
                <div className='flex-row product-detail-card-amount'>
                  <div className='flex-row amount-container'>
                    <div className='amount-container-left'>
                      <button
                        className='btn btn-modify-number btn-modify-number-disabled-style' onClick={(event) => {
                          event.stopPropagation()
                          setProductAmount(Math.max(1, productAmount - 1))
                        }}
                      >
                        <RemoveOutlinedIcon />
                      </button>
                    </div>
                    <div className='amount-container-number'>{productAmount}</div>
                    <div className='amount-container-right'>
                      <button
                        className='btn btn-modify-number' onClick={(event) => {
                          event.stopPropagation()
                          setProductAmount(productAmount + 1)
                        }}
                      >
                        <AddOutlinedIcon />
                      </button>
                    </div>
                  </div>
                </div>
                <button className='btn btn-success btn-bottom-spaced' onClick={() => buyItem()}>Comprar ahora</button>
                <button className='btn btn-secondary btn-bottom-spaced' onClick={() => addToCart()}>Agregar al carrito</button>
                {userInfo?.role === 'ADMIN'
                  ? (
                    <div className='flex-column product-detail-admin-btn-container'>
                      <button className='btn btn-light spaced btn-bottom-spaced' onClick={() => navigate(`/edit/${productDetails.id}`)}>Editar producto</button>
                      <button className='btn btn-outline-danger btn-bottom-spaced' onClick={() => setShowModalDelete(true)}>Eliminar producto</button>
                    </div>
                    )
                  : ''}
              </div>
            </div>
          </div>
          )
        : ''}
      <CustomModal
        title='Error al cargar producto'
        showModal={showModalNoProductData}
        setShowModal={setShowModalNoProductData}
        text='No se encontró la información de este producto. Vuelve al inicio para seguir comprando'
        onYes={() => {
          setNavSearch('')
          navigate('/')
        }}
        onNo={() => {
          setNavSearch('')
          navigate('/')
        }}
        isCancelButton={false}
        textYes='Volver a Inicio'
      />
      <CustomModal
        title='Eliminar producto'
        showModal={showModalDelete}
        setShowModal={setShowModalDelete}
        text='¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer'
        onYes={() => setDeleteProduct(true)}
        textYes='Eliminar producto'
        textNo='Cancelar'
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
    </div>
  )
}

export default ProductDetail
