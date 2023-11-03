import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import useAuthContext from '@/Context/AuthContext/useAuthContext'
import useCartContext from '@/Context/CartContext/useCartContext'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

const Login = () => {
  const navigate = useNavigate()

  const { setToken, setLoginStatus, setUserInfo } = useAuthContext()
  const { setCart } = useCartContext()
  const [loginInfo, setLoginInfo] = useState({})

  useEffect(() => {
    console.log('effect', loginInfo)
    if (loginInfo?.email) {
      console.log('Logging in')
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
        console.log(value.ok)
        if (value.ok) {
          return value.json()
        } else {
          setLoginStatus(false)
          throw new Error('No está permitido')
        }
      })
        .then((value) => {
          console.log(value)
          console.log(value.token)
          const userData = JSON.parse(atob(value.token.split('.')[1]))
          console.log(userData)
          sessionStorage.setItem('token', value.token)
          sessionStorage.setItem('loginStatus', JSON.stringify(true))
          sessionStorage.setItem('userInfo', JSON.stringify(userData))
          sessionStorage.setItem('cart', JSON.stringify([]))
          setLoginStatus(true)
          setToken(value.token)
          setCart([])
          setUserInfo(userData)
          navigate('/')
        })
        .catch((e) => {
          console.log(e)
        })
    }
  }, [loginInfo, setToken, setLoginStatus, setUserInfo, navigate, setCart])

  const loginFormSchema = yup.object().shape({
    email: yup.string().required('Ingresa un email válido').email('Debes ingresar un email válido'),
    password: yup.string().required('No ingresaste una contraseña')
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
    <>
      <h2>Inicia sesión para empezar a comprar</h2>
      <div className='login'>
        <div className='login-container'>
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{ display: 'flex', flexDirection: 'column' }}
          >
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
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
      <p>¿Nuevo usuario?</p>
      <Link to='/signup'>Regístrate ahora</Link>
    </>
  )
}

export default Login
