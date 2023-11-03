import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const NewProduct = () => {
  const [registerProduct, setRegisterProduct] = useState({})

  // useEffect(() => {
  //   console.log('effect:', signUpInfo)
  //   if (signUpInfo?.email?.length > 0) {
  //     console.log('Signing up')
  //     const register = fetch('https://eagle-market.onrender.com/register', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({
  //         ...signUpInfo
  //       })
  //     })

  //     register.then((value) => {
  //       console.log(value)
  //       if (value.ok) {
  //         return value.json()
  //       } else {
  //         throw new Error('No está permitido')
  //       }
  //     })
  //       .then((value) => {
  //         console.log(value)
  //       })
  //       .catch((e) => {
  //         console.log(e)
  //       })
  //   }
  // }, [registerProduct])

  const categoriesAllowed = ['Books', 'Movies', 'Music', 'Games', 'Electronics', 'Computers',
    'Home', 'Garden', 'Tools', 'Grocery', 'Health', 'Beauty', 'Toys', 'Kids', 'Baby', 'Clothing',
    'Jewerly', 'Sports', 'Outdoors', 'Automotive', 'Industrial', 'Other']

  const registerProductFormSchema = yup.object().shape({
    product_name: yup.string().required('Escribe el nombre de tu producto'),
    brand: yup.string().required('Escribe la marca de tu producto'),
    price: yup.number().positive('El precio debe ser positivo').required('Escribe el precio de tu producto'),
    category: yup.mixed().oneOf(categoriesAllowed, 'Selecciona la categoría de tu producto').defined(),
    description: yup.string().required('Escribe la descripción de tu producto'),
    sku: yup.string(),
    image: yup.string().url('Ingresa una url válida').required('Ingresa una url')
  })

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(registerProductFormSchema)
  })

  const onSubmit = (data) => {
    console.log('datos del formulario', data)
    // setSignUpInfo({ ...data })
  }

  return (
    <>
      <h2>Regístrate ahora para iniciar a comprar</h2>
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
              {categoriesAllowed.map((element, index) => {
                return <option value={element} key={index}>{element}</option>
              })}
            </select>
            <p>{errors.category?.message}</p>

            <label htmlFor='role'>Rol</label>
            <select name='role' id='role' {...register('role')}>
              <option value=''>Elige un rol</option>
              <option value='CUSTOMER'>Customer</option>
              <option value='ADMIN'>Admin</option>
            </select>
            <p>{errors.role?.message}</p>

            <label htmlFor='email'>Email</label>
            <input
              type='text'
              name='email'
              placeholder='correo@mail.com'
              id='email'
              {...register('email')}
            />
            <p>{errors.email?.message}</p>

            <label htmlFor='password'>Password</label>
            <input
              type='password'
              name='password'
              id='password'
              {...register('password')}
            />
            <p>{errors.password?.message}</p>

            <button type='submit'>
              Iniciar Sesion
            </button>
          </form>
        </div>
      </div>
      <p>Ya eres un usuario?</p>
      <Link to='/login'>Inicia sesión</Link>
    </>
  )
}

export default NewProduct
