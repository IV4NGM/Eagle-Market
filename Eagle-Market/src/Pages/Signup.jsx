import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Signup = () => {
  const [signUpInfo, setSignUpInfo] = useState({})

  useEffect(() => {
    console.log('effect:', signUpInfo)
    if (signUpInfo?.email?.length > 0) {
      console.log('Signing up')
      const register = fetch('https://eagle-market.onrender.com/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...signUpInfo
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
  }, [signUpInfo])

  const signUpFormSchema = yup.object().shape({
    first_name: yup.string().required('Escribe tu nombre'),
    last_name: yup.string().required('Escribe tu apellido'),
    gender: yup.mixed().oneOf(['M', 'F', 'Otro'], 'Selecciona un género').defined(),
    email: yup.string().required('Ingresa un email válido').email('Debes ingresar un email válido'),
    password: yup.string().required('No ingresaste una contraseña').min(5, 'La contraseña debe tener al menos 5 caracteres').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%.^&*])/, 'La contraseña debe tener al menos 5 caracteres, un número, una letra mayúscula, una letra minúscula y un caracter especial'),
    role: yup.mixed().oneOf(['ADMIN', 'CUSTOMER'], 'Selecciona un rol').defined()
  })

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(signUpFormSchema)
  })

  const onSubmit = (data) => {
    console.log('datos del formulario', data)
    setSignUpInfo({ ...data })
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
            <label htmlFor='first_name'>Nombre</label>
            <input
              type='text'
              name='first_name'
              placeholder='Tu Nombre'
              id='first_name'
              {...register('first_name', { required: true, maxLength: 20 })}
            />
            <p>{errors.first_name?.message}</p>

            <label htmlFor='last_name'>Apellido</label>
            <input
              type='text'
              name='last_name'
              placeholder='Tu Apellido'
              id='last_name'
              {...register('last_name', { pattern: /^[A-Za-z]+$/i })}
            />
            <p>{errors.last_name?.message}</p>

            <label htmlFor='gender'>Genero</label>
            <select name='gender' id='gender' {...register('gender')}>
              <option value=''>Elige un genero</option>
              <option value='M'>Masculino</option>
              <option value='F'>Femenino</option>
              <option value='Otro'>Otro</option>
            </select>
            <p>{errors.gender?.message}</p>

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

export default Signup
