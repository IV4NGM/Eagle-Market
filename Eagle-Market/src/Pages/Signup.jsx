import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useProductsContext from '@/Context/ProductsContext/useProductsContext'
import CustomModal from '@/Components/CustomModal/CustomModal'
import LoggedRedirect from '@/Context/AuthContext/LoggedRedirect'
import useAuthContext from '@/Context/AuthContext/useAuthContext'

const Signup = () => {
  const navigate = useNavigate()
  const [signUpInfo, setSignUpInfo] = useState({})
  const { setApiCall } = useProductsContext()
  const { token } = useAuthContext()

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
          case 403: setErrorMessage('Ya existe un usuario registrado con este correo electrónico')
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
    password: yup.string().required('Ingresa tu contraseña').min(5, 'La contraseña debe tener al menos 5 caracteres').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%.^&*])/, 'La contraseña debe tener un número, una letra mayúscula, una letra minúscula y un caracter especial'),
    confirm_password: yup.string().oneOf([yup.ref('password'), null], 'Las contraseñas no coinciden').required('Vuelve a escribir tu contraseña'),
    role: yup.mixed().oneOf(['ADMIN', 'CUSTOMER'], 'Selecciona un rol').defined()
  })

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(signUpFormSchema)
  })

  const onSubmit = (data) => {
    console.log('datos del formulario', data)
    const dataToPost = { ...data }
    delete dataToPost.confirm_password
    setSignUpInfo({ ...dataToPost })
  }

  return (
    <div className='page-container'>
      <LoggedRedirect />
      <h2>Regístrate ahora para iniciar a comprar</h2>
      <div className='form'>
        <div className='form-container'>
          <form
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className='form-floating'>
              <input
                type='text'
                name='first_name'
                placeholder='Tu Nombre'
                id='first_name'
                className='form-control'
                {...register('first_name', { required: true, maxLength: 20 })}
              />
              <label htmlFor='first_name'>Nombre</label>
            </div>
            <p className='warning-text'>{errors.first_name?.message}</p>

            <div className='form-floating'>
              <input
                type='text'
                name='last_name'
                placeholder='Tu Apellido'
                id='last_name'
                className='form-control'
                {...register('last_name')}
              />
              <label htmlFor='last_name'>Apellido</label>
            </div>
            <p className='warning-text'>{errors.last_name?.message}</p>

            <select name='gender' className='form-select' id='gender' {...register('gender')}>
              <option value=''>Elige un género</option>
              <option value='M'>Masculino</option>
              <option value='F'>Femenino</option>
              <option value='O'>Otro</option>
            </select>
            <p className='warning-text'>{errors.gender?.message}</p>

            <select name='role' className='form-select' id='role' {...register('role')}>
              <option value=''>Elige un rol</option>
              <option value='CUSTOMER'>Cliente</option>
              <option value='ADMIN'>Administrador</option>
            </select>
            <p className='warning-text'>{errors.role?.message}</p>

            <div className='form-floating'>
              <input
                type='text'
                name='email'
                placeholder='correo@mail.com'
                id='email'
                className='form-control'
                {...register('email')}
              />
              <label htmlFor='email'>Correo electrónico</label>
            </div>
            <p className='warning-text'>{errors.email?.message}</p>

            <div className='form-floating'>
              <input
                type='password'
                name='password'
                id='password'
                placeholder='contraseña'
                className='form-control'
                {...register('password')}
              />
              <label htmlFor='password'>Contraseña</label>
            </div>
            <p className='warning-text'>{errors.password?.message}</p>

            <div className='form-floating'>
              <input
                type='password'
                name='confirm_password'
                id='confirm_password'
                placeholder='contraseña'
                className='form-control'
                {...register('confirm_password')}
              />
              <label htmlFor='confirm_password'>Confirma tu contraseña</label>
            </div>
            <p className='warning-text'>{errors.confirm_password?.message}</p>

            <p className='error-text'>{errorMessage}</p>
            <button type='submit' className='btn btn-success btn-form'>
              Registrarse
            </button>
          </form>
          <p>¿Ya eres un usuario?</p>
          <Link to='/login'>Inicia sesión</Link>
        </div>
      </div>
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
    </div>
  )
}

export default Signup
