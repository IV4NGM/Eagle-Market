import useAuthContext from '@/Context/useAuthContext'

const Home = () => {
  const { token, userInfo, setToken } = useAuthContext()
  return (
    <div>Bienvenido {userInfo.first_name}</div>
  )
}

export default Home
