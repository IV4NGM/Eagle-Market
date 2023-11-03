import useCartContext from '@/Context/CartContext/useCartContext'
import ProductCard from '@/Components/ProductCard/ProductCard'

const Checkout = () => {
  const { cart, setCart, productToBuy, setProductToBuy } = useCartContext()

  return (
    <>
      {Object.keys(productToBuy).length > 0
        ? <> <h2>Comprar ahora</h2> <ProductCard data={productToBuy} /> <button>Comprar ahora</button> <button>Agregar al carrito y comprar todo</button> </>
        : ''}
      <h3>Carrito</h3>
      {cart.map((element, index) => {
        return <ProductCard data={element} key={index} />
      })}
      <button>Comprar carrito</button>
    </>
  )
}

export default Checkout
