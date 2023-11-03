import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useEffect, useState } from 'react'
import useAuthContext from '@/Context/AuthContext/useAuthContext'

const NewProduct = () => {
  const [registerProduct, setRegisterProduct] = useState({})
  const { token } = useAuthContext()

  useEffect(() => {
    console.log('effect:', registerProduct)
    if (registerProduct?.product_name?.length > 0) {
      console.log('Registrando')
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
        if (value.ok) {
          return value.json()
        } else {
          throw new Error('No está permitido')
        }
      })
        .then((value) => {
          console.log(value)
        })
        .catch((e) => {
          console.log(e)
        })
    }
  }, [registerProduct, token])

  const categoriesAllowed = ['Books', 'Movies', 'Music', 'Games', 'Electronics', 'Computers',
    'Home', 'Garden', 'Tools', 'Grocery', 'Health', 'Beauty', 'Toys', 'Kids', 'Baby', 'Clothing',
    'Jewerly', 'Sports', 'Outdoors', 'Automotive', 'Industrial', 'Other']

  const registerProductFormSchema = yup.object().shape({
    product_name: yup.string().required('Escribe el nombre de tu producto'),
    brand: yup.string().required('Escribe la marca de tu producto'),
    price: yup.number('Debes ingresar un número').positive('El precio debe ser positivo').required('Escribe el precio de tu producto'),
    category: yup.mixed().oneOf(categoriesAllowed, 'Selecciona la categoría de tu producto').defined(),
    description: yup.string().required('Escribe la descripción de tu producto'),
    sku: yup.string(),
    image: yup.string().required('Ingresa una url')
  })

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(registerProductFormSchema)
  })

  const onSubmit = (data) => {
    console.log('datos del formulario', data)
    setRegisterProduct({ ...data })
  }

  return (
    <>
      <h2>Crear un nuevo producto</h2>
      <div className='login'>
        <div className='login-container'>
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

            <label htmlFor='image'>URL de la imagen del producto</label>
            <input
              type='text'
              name='image'
              placeholder='URL'
              id='image'
              {...register('image')}
            />
            <p>{errors.image?.message}</p>

            <button type='submit'>
              Crear producto
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default NewProduct
