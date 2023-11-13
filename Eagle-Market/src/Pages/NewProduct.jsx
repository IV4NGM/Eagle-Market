import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useEffect, useState } from 'react'
import useAuthContext from '@/Context/AuthContext/useAuthContext'
import useProductsContext from '@/Context/ProductsContext/useProductsContext'
import CustomModal from '@/Components/CustomModal/CustomModal'
import { useNavigate } from 'react-router-dom'
import NoAdminRedirect from '@/Context/AuthContext/NoAdminRedirect'
import ProductDefaultImage from '@/assets/product-default-image.png'

const NewProduct = () => {
  const navigate = useNavigate()
  const [registerProduct, setRegisterProduct] = useState({})
  const { token } = useAuthContext()
  const { setApiCall } = useProductsContext()

  const [showModalFailure, setShowModalFailure] = useState(false)
  const [showModalSuccess, setShowModalSuccess] = useState(false)

  const [imageSrc, setImageSrc] = useState('url')
  const [imageUrl, setImageUrl] = useState('')
  const [imageFile, setImageFile] = useState()
  const [base64Image, setBase64Image] = useState('')
  const [base64ErrorText, setBase64ErrorText] = useState('')

  useEffect(() => {
    console.log('effect:', registerProduct)
    if (registerProduct?.product_name?.length > 0) {
      console.log('Registrando')
      setApiCall(false)
      const register = fetch('https://eagle-market.onrender.com/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...registerProduct
        })
      })

      register.then((value) => {
        console.log(value)
        setApiCall(true)
        switch (value.status) {
          case 200: return value.json()
          default: throw new Error('No está permitido')
        }
      })
        .then((value) => {
          console.log(value)
          setShowModalSuccess(true)
        })
        .catch((e) => {
          console.log(e)
          setApiCall(true)
          setShowModalFailure(true)
        })
    }
    window.scrollTo(0, 0)
  }, [registerProduct, setApiCall, token])

  // const categoriesAllowed = ['Automotive', 'Baby', 'Beauty', 'Books', 'Clothing', 'Computers', 'Electronics',
  //   'Games', 'Garden', 'Grocery', 'Health', 'Home', 'Industrial', 'Jewerly', 'Kids', 'Movies', 'Music',
  //   'Outdoors', 'Sports', 'Tools', 'Toys', 'Other']
  const categoriesAllowed = ['Automóviles', 'Bebés', 'Belleza', 'Computadoras', 'Deportes',
    'Despensa', 'Electrónicos', 'Exterior', 'Herramientas', 'Hogar', 'Industrial', 'Jardín',
    'Joyería', 'Juegos', 'Juguetes', 'Libros', 'Música', 'Niños', 'Películas', 'Ropa', 'Salud', 'Zapatos', 'Otros']

  const registerProductFormSchema = yup.object().shape({
    product_name: yup.string().required('Escribe el nombre de tu producto'),
    brand: yup.string().required('Escribe la marca de tu producto'),
    price: yup.string('Debes ingresar un número').required('Escribe el precio de tu producto').matches(/^[1-9]\d*(\.\d{1,2})?$/, 'El precio debe ser un número con máximo 2 decimales').typeError('Debes ingresar un número'),
    category: yup.mixed().oneOf(categoriesAllowed, 'Selecciona la categoría de tu producto').defined(),
    description: yup.string().required('Escribe la descripción de tu producto'),
    sku: yup.string(),
    image: yup.string()
  })

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(registerProductFormSchema)
  })

  const onSubmit = (data) => {
    console.log('datos del formulario', data)
    const dataToPost = { ...data }
    if (imageSrc === 'url') {
      setBase64Image('')
    } else {
      dataToPost.image = ''
    }
    dataToPost.price = Number(dataToPost.price)
    setRegisterProduct({ ...dataToPost, base64Image })
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
    console.log(file.type)
    if (validImageExtensions.includes(file.type)) {
      try {
        const base64ImageResult = await convertBase64(file)
        setBase64ErrorText('')
        setBase64Image(base64ImageResult)
      } catch (error) {
        setBase64ErrorText('No se pudo procesar tu imagen. Intenta nuevamente más tarde')
      }
    } else {
      setBase64ErrorText('El formato de archivo no está permitido')
    }
  }

  return (
    <div className='page-container'>
      <NoAdminRedirect />
      <h2>Crear un nuevo producto</h2>
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
                {...register('price')}
              />
              <label htmlFor='price'>Precio del producto</label>
            </div>
            <p className='warning-text'>{errors.price?.message}</p>

            <select name='category' className='form-select' id='category' {...register('category')}>
              <option value=''>Selecciona una categoría</option>
              {categoriesAllowed.map((element, index) => {
                return <option value={element} key={index}>{element}</option>
              })}
            </select>
            <p className='warning-text'>{errors.category?.message}</p>

            <div className='form-floating'>
              <textarea
                name='description'
                placeholder='Descripción de tu producto'
                id='description'
                className='form-control'
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
              ? <>
                <div className='form-floating'>
                  <input
                    type='text'
                    name='image'
                    placeholder='URL'
                    id='image'
                    className='form-control'
                    {...register('image')}
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
              : <div className='form-flex-column'>
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
                </div>}

            <button type='submit' className='btn btn-success'>
              Crear producto
            </button>
          </form>
        </div>
      </div>
      <CustomModal
        title='Error al crear el producto'
        showModal={showModalFailure}
        setShowModal={setShowModalFailure}
        text='Hubo un error al intentar crear el producto. Intente de nuevo más tarde'
        isCancelButton={false}
        textYes='Regresar'
        estatico
      />
      <CustomModal
        title='Producto creado exitosamente'
        showModal={showModalSuccess}
        setShowModal={setShowModalSuccess}
        text='Se ha creado el producto exitosamente. Vuelve a Inicio para seguir comprando'
        onYes={() => {
          navigate('/')
        }}
        onNo={() => {
          navigate(-1)
        }}
        textYes='Volver a Inicio'
        textNo='Atrás'
      />
    </div>
  )
}

export default NewProduct
