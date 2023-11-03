import useAuthContext from '@/Context/AuthContext/useAuthContext'
import CardsContainer from '@/Components/CardsContainer/CardsContainer'

const Home = () => {
  const { token, userInfo, setToken } = useAuthContext()
  console.log(userInfo?.role === 'ADMIN')
  return (
    <>
      <div>Bienvenido {userInfo.first_name}</div>
      <CardsContainer isAdmin={userInfo?.role === 'ADMIN'} />
    </>
  )
}

export default Home
