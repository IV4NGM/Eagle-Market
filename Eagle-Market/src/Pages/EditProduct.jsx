import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useAuthContext from '@/Context/AuthContext/useAuthContext'
import NoAdminRedirect from '@/Context/AuthContext/NoAdminRedirect'
import useProductsContext from '@/Context/ProductsContext/useProductsContext'
import CustomModal from '@/Components/CustomModal/CustomModal'
import ProductDefaultImage from '@/assets/product-default-image.png'
import useCartContext from '@/Context/CartContext/useCartContext'

const EditProduct = () => {
  const navigate = useNavigate()

  const [registerProduct, setRegisterProduct] = useState({})

  const { token } = useAuthContext()
  const { id } = useParams()
  const [productDetails, setProductDetails] = useState({})
  const { setNavSearch, setApiCall } = useProductsContext()
  const { cart, setCart, productToBuy, setProductToBuy } = useCartContext()

  const [showModalNoProductData, setShowModalNoProductData] = useState(false)

  const [showModalFailure, setShowModalFailure] = useState(false)
  const [showModalSuccess, setShowModalSuccess] = useState(false)

  const [showModalCancel, setShowModalCancel] = useState(false)

  const [deleteProduct, setDeleteProduct] = useState(false)
  const [showModalDelete, setShowModalDelete] = useState(false)
  const [showModalDeleteFailure, setShowModalDeleteFailure] = useState(false)
  const [showModalDeleteSuccess, setShowModalDeleteSuccess] = useState(false)

  const [imageSrc, setImageSrc] = useState('url')
  const [imageUrl, setImageUrl] = useState('')
  const [imageFile, setImageFile] = useState()
  const [base64Image, setBase64Image] = useState('')
  const [base64ErrorText, setBase64ErrorText] = useState('')

  useEffect(() => {
    if (registerProduct?.product_name?.length > 0 && token) {
      setApiCall(false)
      const register = fetch(`https://eagle-market.onrender.com/edit/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...registerProduct
        })
      })

      register.then((value) => {
        setApiCall(true)
        if (value.ok) {
          return value.json()
        } else {
          throw new Error('No está permitido')
        }
      })
        .then((value) => {
          setShowModalSuccess(true)
        })
        .catch((e) => {
          setApiCall(true)
          setShowModalFailure(true)
        })
    } else if (!deleteProduct) {
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
            setBase64Image(result.base64Image)
            if (result.base64Image) {
              setImageFile(result.base64Image)
            }
            setImageUrl(result.image)
            setImageSrc(result.base64Image ? 'file' : 'url')
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
          setShowModalDeleteSuccess(true)
        })
        .catch((e) => {
          setApiCall(true)
          setShowModalDeleteFailure(true)
        })
    }
    window.scrollTo(0, 0)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, registerProduct, token, deleteProduct])

  const categoriesAllowed = ['Automóviles', 'Bebés', 'Belleza', 'Computadoras', 'Deportes',
    'Despensa', 'Electrónicos', 'Exterior', 'Herramientas', 'Hogar', 'Industrial', 'Jardín',
    'Joyería', 'Juegos', 'Juguetes', 'Libros', 'Música', 'Niños', 'Películas', 'Ropa', 'Salud', 'Zapatos', 'Otros']

  yup.addMethod(yup.string, 'stripEmptyString', function () {
    return this.transform((value) => (value === '' ? undefined : value))
  })

  yup.addMethod(yup.number, 'stripEmptyNumber', function () {
    return this.transform((value) => (!Number(value) ? undefined : value))
  })

  const registerProductFormSchema = yup.object().shape({
    product_name: yup.string().required('Escribe el nombre de tu producto').stripEmptyString().default(productDetails.product_name),
    brand: yup.string().required('Escribe la marca de tu producto').stripEmptyString().default(productDetails.brand),
    price: yup.string('Debes ingresar un número').required('Escribe el precio de tu producto').matches(/^[1-9]\d*(\.\d{1,2})?$/, 'El precio debe ser un número con máximo 2 decimales').typeError('Debes ingresar un número'),
    category: yup.mixed().oneOf(categoriesAllowed, 'Selecciona la categoría de tu producto').defined().default(productDetails.category),
    description: yup.string().required('Escribe la descripción de tu producto').stripEmptyString().default(productDetails.description),
    sku: yup.string().stripEmptyString().default(productDetails.sku)
  })

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(registerProductFormSchema)
  })

  const onSubmit = (data) => {
    const dataToPost = { ...data, image: imageUrl, base64Image }
    if (imageSrc === 'url') {
      dataToPost.base64Image = ''
      setBase64Image('')
    } else {
      dataToPost.image = ''
    }
    dataToPost.price = Number(dataToPost.price)
    setRegisterProduct({ ...dataToPost })
  }

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.readAsDataURL(file)
      fileReader.onload = () => {
        resolve(fileReader.result)
      }
      fileReader.onerror = (error) => {
        reject(error)
      }
    })
  }

  const validImageExtensions = ['image/jpg', 'image/png', 'image/jpeg', 'image/svg', 'image/webp']

  const handleFileRead = async (event) => {
    const file = event.target.files[0]
    if (validImageExtensions.includes(file.type)) {
      const base64ImageResult = await convertBase64(file)
      setBase64ErrorText('')
      setBase64Image(base64ImageResult)
    } else {
      setBase64ErrorText('El formato de archivo no está permitido')
    }
  }

  return (
    <div className='page-container'>
      <NoAdminRedirect />
      <h2>Modificar producto</h2>
      <div className='form form-product'>
        <div className='form-container'>
          <form
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className='form-floating'>
              <input
                type='text'
                name='product_name'
                placeholder='Nombre del producto'
                id='product_name'
                className='form-control'
                defaultValue={productDetails.product_name}
                {...register('product_name')}
              />
              <label htmlFor='product_name'>Nombre del producto</label>
            </div>
            <p className='warning-text'>{errors.product_name?.message}</p>

            <div className='form-floating'>
              <input
                type='text'
                name='brand'
                placeholder='Tu marca'
                id='brand'
                className='form-control'
                defaultValue={productDetails.brand}
                {...register('brand')}
              />
              <label htmlFor='brand'>Marca del producto</label>
            </div>
            <p className='warning-text'>{errors.brand?.message}</p>

            <div className='form-floating'>
              <input
                type='text'
                name='price'
                placeholder='Precio'
                id='price'
                className='form-control'
                defaultValue={productDetails.price}
                {...register('price')}
              />
              <label htmlFor='price'>Precio del producto</label>
            </div>
            <p className='warning-text'>{errors.price?.message}</p>

            {productDetails?.product_name
              ? (
                <>
                  <select name='category' className='form-select' id='category' defaultValue={productDetails.category} {...register('category')}>
                    <option value=''>Selecciona una categoría</option>
                    {categoriesAllowed.map((element, index) => {
                      return <option value={element} key={index}>{element}</option>
                    })}
                  </select>
                  <p className='warning-text'>{errors.category?.message}</p>
                </>
                )
              : ''}

            <div className='form-floating'>
              <textarea
                name='description'
                placeholder='Descripción de tu producto'
                id='description'
                className='form-control'
                defaultValue={productDetails.description}
                {...register('description')}
              />
              <label htmlFor='description'>Descripción del producto</label>
            </div>
            <p className='warning-text'>{errors.description?.message}</p>

            <div className='form-floating'>
              <input
                type='text'
                name='sku'
                placeholder='SKU de tu producto'
                id='sku'
                className='form-control'
                defaultValue={productDetails.sku}
                {...register('sku')}
              />
              <label htmlFor='sku'>SKU del producto</label>
            </div>
            <p className='warning-text'>{errors.sku?.message}</p>

            <p className='medium-text'>Imagen del producto</p>
            <div className='form-flex-row'>
              <div className='form-check'>
                <input className='form-check-input' type='radio' name='image-src' id='image-src-url' value='url' checked={imageSrc === 'url'} onChange={(event) => setImageSrc(event.target.value)} />
                <label className='form-check-label' htmlFor='image-src-url'>
                  URL
                </label>
              </div>
              <div className='form-check'>
                <input className='form-check-input' type='radio' name='image-src' id='image-src-file' value='file' checked={imageSrc === 'file'} onChange={(event) => setImageSrc(event.target.value)} />
                <label className='form-check-label' htmlFor='image-src-file'>
                  De archivo
                </label>
              </div>
            </div>

            {imageSrc === 'url'
              ? (
                <>
                  <div className='form-floating'>
                    <input
                      type='text'
                      name='image'
                      placeholder='URL'
                      id='image'
                    // defaultValue={productDetails.image}
                      className='form-control'
                    // {...register('image')}
                      value={imageUrl}
                      onChange={(event) => setImageUrl(event.target.value)}
                    />
                    <label htmlFor='image'>URL de la imagen del producto</label>
                  </div>
                  <img
                    src={imageUrl || ProductDefaultImage || ''} className='product-image-card edit-image' alt='Product-image' onError={({ currentTarget }) => {
                      currentTarget.onerror = null
                      currentTarget.src = ProductDefaultImage
                    }}
                  />
                  <p className='warning-text'>{errors.image?.message}</p>
                </>
                )
              : (
                <div className='form-flex-column'>
                  <input
                    type='file'
                    name='image64'
                    id='image64'
                    className='form-control'
                    onChange={(event) => {
                      setImageFile(URL.createObjectURL(event.target.files[0]))
                      handleFileRead(event)
                    }}
                  />
                  <img src={imageFile || ProductDefaultImage} className='product-image-card edit-image' alt='Product-image' />
                  <p className='warning-text'>{base64ErrorText}</p>
                </div>
                )}
            <button type='submit' className='btn btn-success'>
              Modificar producto
            </button>
          </form>
          <div className='flex-row buttons-row'>
            <button className='btn btn-outline-secondary' onClick={() => setShowModalCancel(true)}>Descartar cambios</button>
            <button className='btn btn-outline-danger' onClick={() => setShowModalDelete(true)}>Eliminar producto</button>
          </div>
        </div>
      </div>
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
        title='Error al modificar el producto'
        showModal={showModalFailure}
        setShowModal={setShowModalFailure}
        text='Hubo un error al intentar modificar el producto. Intente de nuevo más tarde'
        isCancelButton={false}
        textYes='Regresar'
        estatico
      />
      <CustomModal
        title='Producto modificado exitosamente'
        showModal={showModalSuccess}
        setShowModal={setShowModalSuccess}
        text='Se ha modificado el producto exitosamente. Vuelve a Inicio para seguir comprando'
        onYes={() => {
          navigate('/')
        }}
        onNo={() => {
          navigate(-1)
        }}
        textYes='Volver a Inicio'
        textNo='Atrás'
      />
      <CustomModal
        title='Descartar cambios'
        showModal={showModalCancel}
        setShowModal={setShowModalCancel}
        text='¿Estás seguro de descartar los cambios?'
        onYes={() => {
          navigate('/')
        }}
        textYes='Descartar cambios'
        textNo='Seguir editando'
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
        showModal={showModalDeleteFailure}
        setShowModal={setShowModalDeleteFailure}
        text='Hubo un error al eliminar el producto. Intente de nuevo más tarde'
        isCancelButton={false}
        textYes='Regresar'
        estatico
      />
      <CustomModal
        title='Producto eliminado exitosamente'
        showModal={showModalDeleteSuccess}
        setShowModal={setShowModalDeleteSuccess}
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
    </div>
  )
}

export default EditProduct
