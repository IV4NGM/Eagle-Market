import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useProductsContext from '@/Context/ProductsContext/useProductsContext'
import CustomModal from '@/Components/CustomModal/CustomModal'

const Signup = () => {
  const navigate = useNavigate()
  const [signUpInfo, setSignUpInfo] = useState({})
  const { setApiCall } = useProductsContext()

  const [errorMessage, setErrorMessage] = useState('')
  const [showModalFailure, setShowModalFailure] = useState(false)
  const [showModalSuccess, setShowModalSuccess] = useState(false)

  useEffect(() => {
    console.log('effect:', signUpInfo)
    if (signUpInfo?.email?.length > 0) {
      console.log('Signing up')
      setApiCall(false)
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
        setApiCall(true)
        switch (value.status) {
          case 201: return value.json()
          case 400: setErrorMessage('Revisa tus datos e intenta nuevamente')
            throw new Error('IncorrectData')
          case 403: setErrorMessage('Ya existe un usuario con ese email')
            throw new Error('IncorrectData')
          default: setShowModalFailure(true)
        }
      })
        .then((value) => {
          console.log(value)
          setErrorMessage('')
          setShowModalSuccess(true)
        })
        .catch((e) => {
          console.log(e)
          setApiCall(true)
          if (e.message !== 'IncorrectData') {
            setShowModalFailure(true)
          }
        })
    }
  }, [setApiCall, signUpInfo])

  const signUpFormSchema = yup.object().shape({
    first_name: yup.string().required('Escribe tu nombre'),
    last_name: yup.string().required('Escribe tu apellido'),
    gender: yup.mixed().oneOf(['M', 'F', 'O'], 'Selecciona un género').defined(),
    email: yup.string().required('Ingresa un email válido').matches(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Debes ingresar un email válido'),
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
              <option value='O'>Otro</option>
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

            <p style={{ color: 'red' }}>{errorMessage}</p>
            <button type='submit'>
              Registrarse
            </button>
          </form>
        </div>
      </div>
      <p>¿Ya eres un usuario?</p>
      <Link to='/login'>Inicia sesión</Link>
      <CustomModal
        title='Error al crear usuario'
        showModal={showModalFailure}
        setShowModal={setShowModalFailure}
        text='Hubo un error al intentar crear el usuario. Intente de nuevo más tarde'
        isCancelButton={false}
        textYes='Regresar'
        estatico
      />
      <CustomModal
        title='Usuario creado exitosamente'
        showModal={showModalSuccess}
        setShowModal={setShowModalSuccess}
        text='Se ha creado el usuario exitosamente. ¡Inicia sesión para empezar a comprar!'
        onYes={() => {
          navigate('/login')
        }}
        onNo={() => {
          navigate('/login')
        }}
        isCancelButton={false}
        textYes='Iniciar sesión'
      />
    </>
  )
}

export default Signup
