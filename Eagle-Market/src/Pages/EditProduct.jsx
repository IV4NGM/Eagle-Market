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

const EditProduct = () => {
  const navigate = useNavigate()

  const [registerProduct, setRegisterProduct] = useState({})

  const { token } = useAuthContext()
  const { id } = useParams()
  const [productDetails, setProductDetails] = useState({})
  const { setApiCall } = useProductsContext()

  const [showModalFailure, setShowModalFailure] = useState(false)
  const [showModalSuccess, setShowModalSuccess] = useState(false)

  const [imageSrc, setImageSrc] = useState('url')
  const [imageFile, setImageFile] = useState()
  const [base64Image, setBase64Image] = useState('')
  const [base64ErrorText, setBase64ErrorText] = useState('')

  useEffect(() => {
    console.log('effect:', registerProduct)
    if (registerProduct?.product_name?.length > 0 && token) {
      console.log('Actualizando')
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
        console.log(value)
        setApiCall(true)
        if (value.ok) {
          return value.json()
        } else {
          throw new Error('No está permitido')
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
    } else {
      console.log('Getting')
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
          console.log(result)
          setBase64Image(result.base64Image)
          if (result.base64Image) {
            setImageFile(result.base64Image)
          }
          setImageSrc(result.base64Image ? 'file' : 'url')
          setProductDetails(result)
        })
        .catch(e => {
          console.log(e)
        })
    }
  }, [id, registerProduct, token])

  const categoriesAllowed = ['Automotive', 'Baby', 'Beauty', 'Books', 'Clothing', 'Computers', 'Electronics',
    'Games', 'Garden', 'Grocery', 'Health', 'Home', 'Industrial', 'Jewerly', 'Kids', 'Movies', 'Music',
    'Outdoors', 'Sports', 'Tools', 'Toys', 'Other']

  yup.addMethod(yup.string, 'stripEmptyString', function () {
    return this.transform((value) => (value === '' ? undefined : value))
  })

  yup.addMethod(yup.number, 'stripEmptyNumber', function () {
    return this.transform((value) => (!Number(value) ? undefined : value))
  })

  const registerProductFormSchema = yup.object().shape({
    product_name: yup.string().required('Escribe el nombre de tu producto').stripEmptyString().default(productDetails.product_name),
    brand: yup.string().required('Escribe la marca de tu producto').stripEmptyString().default(productDetails.brand),
    price: yup.number('Debes ingresar un número').positive('El precio debe ser positivo').required('Escribe el precio de tu producto').stripEmptyNumber().default(productDetails.price),
    category: yup.mixed().oneOf(categoriesAllowed, 'Selecciona la categoría de tu producto').defined().default(productDetails.category),
    description: yup.string().required('Escribe la descripción de tu producto').stripEmptyString().default(productDetails.description),
    sku: yup.string().stripEmptyString().default(productDetails.sku),
    image: yup.string()
  })

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(registerProductFormSchema)
  })

  const onSubmit = (data) => {
    console.log('datos del formulario', data)
    const dataToPost = { ...data, base64Image }
    if (imageSrc === 'url') {
      dataToPost.base64Image = ''
      setBase64Image('')
    } else {
      dataToPost.image = ''
    }
    console.log('Modificando a', { ...dataToPost })
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
    console.log(file.type)
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
                type='number'
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
              ? <>
                <select name='category' className='form-select' id='category' defaultValue={productDetails.category} {...register('category')}>
                  <option value=''>Selecciona una categoría</option>
                  {categoriesAllowed.map((element, index) => {
                    return <option value={element} key={index}>{element}</option>
                  })}
                </select>
                <p className='warning-text'>{errors.category?.message}</p>
              </>
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

            <p>Imagen</p>
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
                  />
                  <label htmlFor='image'>URL de la imagen del producto</label>
                </div>
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
                <img src={imageFile || ProductDefaultImage} className='form-image' alt='Product-image' />
                <p className='warning-text'>{base64ErrorText}</p>
              </div>}

            <button type='submit' className='btn btn-success'>
              Modificar producto
            </button>
          </form>
          <div className='form-flex-row'>
            <button className='btn btn-secondary'>Descartar cambios</button>
            <button className='btn btn-danger'>Eliminar producto</button>
          </div>

        </div>
      </div>
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
          navigate('/')
        }}
        isCancelButton={false}
        textYes='Volver a Inicio'
      />
    </div>
  )
}

export default EditProduct
