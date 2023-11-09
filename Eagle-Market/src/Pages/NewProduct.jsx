import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useEffect, useState } from 'react'
import useAuthContext from '@/Context/AuthContext/useAuthContext'
import useProductsContext from '@/Context/ProductsContext/useProductsContext'
import CustomModal from '@/Components/CustomModal/CustomModal'
import { useNavigate } from 'react-router-dom'
import NoAdminRedirect from '@/Context/AuthContext/NoAdminRedirect'

const NewProduct = () => {
  const navigate = useNavigate()
  const [registerProduct, setRegisterProduct] = useState({})
  const { token } = useAuthContext()
  const { setApiCall } = useProductsContext()

  const [showModalFailure, setShowModalFailure] = useState(false)
  const [showModalSuccess, setShowModalSuccess] = useState(false)

  const [imageSrc, setImageSrc] = useState('url')
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
  }, [registerProduct, setApiCall, token])

  const categoriesAllowed = ['Automotive', 'Baby', 'Beauty', 'Books', 'Clothing', 'Computers', 'Electronics',
    'Games', 'Garden', 'Grocery', 'Health', 'Home', 'Industrial', 'Jewerly', 'Kids', 'Movies', 'Music',
    'Outdoors', 'Sports', 'Tools', 'Toys', 'Other']

  const registerProductFormSchema = yup.object().shape({
    product_name: yup.string().required('Escribe el nombre de tu producto'),
    brand: yup.string().required('Escribe la marca de tu producto'),
    price: yup.number('Debes ingresar un número').positive('El precio debe ser positivo').required('Escribe el precio de tu producto'),
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
      const base64ImageResult = await convertBase64(file)
      setBase64ErrorText('')
      setBase64Image(base64ImageResult)
    } else {
      setBase64ErrorText('El formato de archivo no está permitido')
    }
  }

  return (
    <>
      <NoAdminRedirect />
      <h2>Crear un nuevo producto</h2>
      <div className='newproduct'>
        <div className='newproduct-container'>
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            <label htmlFor='product_name'>Nombre del producto</label>
            <input
              type='text'
              name='product_name'
              placeholder='Nombre del producto'
              id='product_name'
              {...register('product_name')}
            />
            <p>{errors.product_name?.message}</p>

            <label htmlFor='brand'>Marca del producto</label>
            <input
              type='text'
              name='brand'
              placeholder='Tu marca'
              id='brand'
              {...register('brand')}
            />
            <p>{errors.brand?.message}</p>

            <label htmlFor='price'>Precio del producto</label>
            <input
              type='number'
              name='price'
              placeholder='Precio'
              id='price'
              {...register('price')}
            />
            <p>{errors.price?.message}</p>

            <label htmlFor='category'>Categoría</label>
            <select name='category' id='category' {...register('category')}>
              <option value=''>Selecciona una categoría</option>
              {categoriesAllowed.map((element, index) => {
                return <option value={element} key={index}>{element}</option>
              })}
            </select>
            <p>{errors.category?.message}</p>

            <label htmlFor='description'>Descripción del producto</label>
            <textarea
              name='description'
              placeholder='Descripción de tu producto'
              id='description'
              {...register('description')}
            />
            <p>{errors.description?.message}</p>

            <label htmlFor='sku'>SKU del producto</label>
            <input
              type='text'
              name='sku'
              placeholder='SKU de tu producto'
              id='sku'
              {...register('sku')}
            />
            <p>{errors.sku?.message}</p>

            <div>
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
              ? <><label htmlFor='image'>URL de la imagen del producto</label>
                <input
                  type='text'
                  name='image'
                  placeholder='URL'
                  id='image'
                  {...register('image')}
                />
                <p>{errors.image?.message}</p>
              </>
              : <>
                <input
                  type='file'
                  name='image64'
                  id='image64'
                  onChange={(event) => {
                    setImageFile(URL.createObjectURL(event.target.files[0]))
                    handleFileRead(event)
                  }}
                />
                <img src={imageFile} alt='Your-image' />
                <p>{base64ErrorText}</p>
                </>}

            <button type='submit'>
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
          navigate('/')
        }}
        isCancelButton={false}
        textYes='Volver a Inicio'
      />
    </>
  )
}

export default NewProduct
