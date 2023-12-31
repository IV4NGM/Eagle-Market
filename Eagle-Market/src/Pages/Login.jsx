import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import useAuthContext from '@/Context/AuthContext/useAuthContext'
import useCartContext from '@/Context/CartContext/useCartContext'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import useProductsContext from '@/Context/ProductsContext/useProductsContext'
import CustomModal from '@/Components/CustomModal/CustomModal'
import LoggedRedirect from '@/Context/AuthContext/LoggedRedirect'

const Login = () => {
  const navigate = useNavigate()

  const { setToken, setLoginStatus, userInfo, setUserInfo, lastLetter, setLastLetter, setHistory } = useAuthContext()
  const { setNavSearch, setApiCall } = useProductsContext()
  const { setCart } = useCartContext()
  const [loginInfo, setLoginInfo] = useState({})
  const [errorMessage, setErrorMessage] = useState('')
  const [showModalFailure, setShowModalFailure] = useState(false)
  const [showModalSuccess, setShowModalSuccess] = useState(false)

  useEffect(() => {
    if (loginInfo?.email) {
      setApiCall(false)
      const login = fetch('https://eagle-market.onrender.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: loginInfo.email,
          password: loginInfo.password
        })
      })

      login.then((value) => {
        setApiCall(true)
        switch (value.status) {
          case 200: return value.json()
          case 401: setErrorMessage('El usuario o contraseña son incorrectos')
            throw new Error('IncorrectData')
          case 404: setErrorMessage('El usuario o contraseña son incorrectos')
            throw new Error('IncorrectData')
          default: setShowModalFailure(true)
        }
      })
        .then((value) => {
          const userData = JSON.parse(atob(value.token.split('.')[1]))
          localStorage.setItem('token', value.token)
          localStorage.setItem('loginStatus', JSON.stringify(true))
          localStorage.setItem('userInfo', JSON.stringify(userData))
          localStorage.setItem('cart', JSON.stringify([]))
          setLoginStatus(true)
          setToken(value.token)
          setCart([])
          setUserInfo(userData)
          setErrorMessage('')
          if (userData?.gender === 'M') {
            localStorage.setItem('lastLetter', 'o')
            setLastLetter('o')
          } else if (userData?.gender === 'F') {
            localStorage.setItem('lastLetter', 'a')
            setLastLetter('a')
          } else {
            localStorage.setItem('lastLetter', '@')
            setLastLetter('@')
          }
          const getHistory = fetch('https://eagle-market.onrender.com/orders-history', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${value.token}`
            }
          })
          return getHistory
        })
        .then((result) => {
          if (result.ok) {
            return result.json()
          } else {
            throw new Error('Error in the server response')
          }
        })
        .then((result) => {
          localStorage.setItem('history', JSON.stringify(result.data))
          setHistory(result.data)
          setApiCall(true)
        })
        .catch((e) => {
          setApiCall(true)
          if (e.message !== 'IncorrectData') {
            setShowModalFailure(true)
          }
        })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginInfo, setToken, setLoginStatus, setUserInfo, navigate, setCart, setApiCall, setLastLetter])

  const loginFormSchema = yup.object().shape({
    // eslint-disable-next-line no-useless-escape
    email: yup.string().required('Ingresa un email válido').matches(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Debes ingresar un email válido'),
    password: yup.string().required('Ingresa tu contraseña')
  })

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginFormSchema)
  })

  const onSubmit = (data) => {
    const email = data.email
    const password = data.password
    setLoginInfo({ email, password })
  }

  return (
    <div className='page-container'>
      <LoggedRedirect />
      <h2>Inicia sesión para empezar a comprar</h2>
      <div className='form'>
        <div className='form-container'>
          <form
            onSubmit={handleSubmit(onSubmit)}
          >
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
                placeholder='contraseña'
                id='password'
                className='form-control'
                {...register('password')}
              />
              <label htmlFor='password'>Contraseña</label>
            </div>
            <p className='warning-text'>{errors.password?.message}</p>

            <p className='error-text'>{errorMessage}</p>
            <button type='submit' className='btn btn-success btn-form'>
              Iniciar Sesión
            </button>
          </form>
          <p>¿Eres un nuevo usuario?</p>
          <Link to='/signup'>Regístrate ahora</Link>
        </div>
      </div>
      <CustomModal
        title='Error al iniciar sesión'
        showModal={showModalFailure}
        setShowModal={setShowModalFailure}
        text='Hubo un error al obtener tus datos de inicio de sesión. Intente de nuevo más tarde'
        isCancelButton={false}
        textYes='Regresar'
        estatico
      />
      <CustomModal
        title={`Bienvenid${lastLetter} de nuevo ${userInfo?.first_name}`}
        showModal={showModalSuccess}
        setShowModal={setShowModalSuccess}
        text='Has iniciado sesión correctamente. ¡Vamos a inicio para empezar a comprar!'
        onYes={() => {
          setNavSearch('')
          navigate('/')
        }}
        onNo={() => {
          setNavSearch('')
          navigate('/')
        }}
        isCancelButton={false}
        textYes='Ir a Inicio'
      />
    </div>
  )
}

export default Login
