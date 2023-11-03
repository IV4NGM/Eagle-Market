import useAuthContext from '@/Context/AuthContext/useAuthContext'
import CardsContainer from '@/Components/CardsContainer/CardsContainer'

const Home = () => {
  const { token, userInfo, setToken } = useAuthContext()
  return (
    <>
      <div>Bienvenido {userInfo.first_name}</div>
      <CardsContainer />
    </>
  )
}

export default Home
