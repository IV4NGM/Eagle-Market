import useAuthContext from '@/Context/AuthContext/useAuthContext'
import CardsContainer from '@/Components/CardsContainer/CardsContainer'

const Home = () => {
  const { userInfo } = useAuthContext()
  console.log(userInfo?.role === 'ADMIN')
  return (
    <>
      <div>Bienvenido {userInfo.first_name}</div>
      {/* <button onClick={() => window.location.reload(false)}>Recargar</button> */}
      <CardsContainer isAdmin={userInfo?.role === 'ADMIN'} />
    </>
  )
}

export default Home
