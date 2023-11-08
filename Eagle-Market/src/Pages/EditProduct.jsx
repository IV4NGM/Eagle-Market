import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useAuthContext from '@/Context/AuthContext/useAuthContext'
import NoAdminRedirect from '@/Context/AuthContext/NoAdminRedirect'
import useProductsContext from '@/Context/ProductsContext/useProductsContext'
import CustomModal from '@/Components/CustomModal/CustomModal'

const EditProduct = () => {
  const navigate = useNavigate()

  const [registerProduct, setRegisterProduct] = useState({})

  const { token } = useAuthContext()
  const { id } = useParams()
  const [productDetails, setProductDetails] = useState({})
  const { setApiCall } = useProductsContext()

  const [showModalFailure, setShowModalFailure] = useState(false)
  const [showModalSuccess, setShowModalSuccess] = useState(false)

  useEffect(() => {
    console.log('effect:', registerProduct)
    if (registerProduct?.product_name?.length > 0 && token) {
      console.log('Actualizando')
      setApiCall(false)
      const register = fetch(`https://eagle-market.onrender.com/edit/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...registerProduct
        })
      })

      register.then((value) => {
        console.log(value)
        setApiCall(true)
        if (value.ok) {
          return value.json()
        } else {
          throw new Error('No está permitido')
        }
      })
        .then((value) => {
          console.log(value)
          setShowModalSuccess(true)
        })
        .catch((e) => {
          console.log(e)
          setApiCall(true)
          setShowModalFailure(true)
        })
    } else {
      console.log('Getting')
      const getProducts = fetch(`https://eagle-market.onrender.com/items/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      getProducts.then((result) => {
        return result.json()
      })
        .then((result) => {
          console.log(result)
          setProductDetails(result)
        })
        .catch(e => {
          console.log(e)
        })
    }
  }, [id, registerProduct, token])

  const categoriesAllowed = ['Books', 'Movies', 'Music', 'Games', 'Electronics', 'Computers',
    'Home', 'Garden', 'Tools', 'Grocery', 'Health', 'Beauty', 'Toys', 'Kids', 'Baby', 'Clothing',
    'Jewerly', 'Sports', 'Outdoors', 'Automotive', 'Industrial', 'Other']

  yup.addMethod(yup.string, 'stripEmptyString', function () {
    return this.transform((value) => (value === '' ? undefined : value))
  })

  yup.addMethod(yup.number, 'stripEmptyNumber', function () {
    return this.transform((value) => (!Number(value) ? undefined : value))
  })

  const registerProductFormSchema = yup.object().shape({
    product_name: yup.string().required('Escribe el nombre de tu producto').stripEmptyString().default(productDetails.product_name),
    brand: yup.string().required('Escribe la marca de tu producto').stripEmptyString().default(productDetails.brand),
    price: yup.number('Debes ingresar un número').positive('El precio debe ser positivo').required('Escribe el precio de tu producto').stripEmptyNumber().default(productDetails.price),
    category: yup.mixed().oneOf(categoriesAllowed, 'Selecciona la categoría de tu producto').defined().default(productDetails.category),
    description: yup.string().required('Escribe la descripción de tu producto').stripEmptyString().default(productDetails.description),
    sku: yup.string().stripEmptyString().default(productDetails.sku),
    image: yup.string().required('Ingresa una url').stripEmptyString().default(productDetails.image)
  })

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(registerProductFormSchema)
  })

  const onSubmit = (data) => {
    console.log('datos del formulario', data)
    setRegisterProduct({ ...data })
  }

  return (
    <>
      <NoAdminRedirect />
      <h2>Modificar</h2>
      <div className='newproduct'>
        <div className='newproduct-container'>
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            <label htmlFor='product_name'>Nombre del producto</label>
            <input
              type='text'
              name='product_name'
              placeholder='Nombre del producto'
              id='product_name'
              defaultValue={productDetails.product_name}
              {...register('product_name')}
            />
            <p>{errors.product_name?.message}</p>

            <label htmlFor='brand'>Marca del producto</label>
            <input
              type='text'
              name='brand'
              placeholder='Tu marca'
              id='brand'
              defaultValue={productDetails.brand}
              {...register('brand')}
            />
            <p>{errors.brand?.message}</p>

            <label htmlFor='price'>Precio del producto</label>
            <input
              type='number'
              name='price'
              placeholder='Precio'
              id='price'
              defaultValue={productDetails.price}
              {...register('price')}
            />
            <p>{errors.price?.message}</p>

            {productDetails?.product_name
              ? <>
                <label htmlFor='category'>Categoría</label>
                <select name='category' id='category' defaultValue={productDetails.category} {...register('category')}>
                  <option value=''>Selecciona una categoría</option>
                  {categoriesAllowed.map((element, index) => {
                    return <option value={element} key={index}>{element}</option>
                  })}
                </select>
                <p>{errors.category?.message}</p>
                </>
              : ''}

            <label htmlFor='description'>Descripción del producto</label>
            <textarea
              name='description'
              placeholder='Descripción de tu producto'
              id='description'
              defaultValue={productDetails.description}
              {...register('description')}
            />
            <p>{errors.description?.message}</p>

            <label htmlFor='sku'>SKU del producto</label>
            <input
              type='text'
              name='sku'
              placeholder='SKU de tu producto'
              id='sku'
              defaultValue={productDetails.sku}
              {...register('sku')}
            />
            <p>{errors.sku?.message}</p>

            <label htmlFor='image'>URL de la imagen del producto</label>
            <input
              type='text'
              name='image'
              placeholder='URL'
              id='image'
              defaultValue={productDetails.image}
              {...register('image')}
            />
            <p>{errors.image?.message}</p>

            <button type='submit'>
              Modificar producto
            </button>
          </form>
        </div>
      </div>
      <CustomModal
        title='Error al modificar el producto'
        showModal={showModalFailure}
        setShowModal={setShowModalFailure}
        text='Hubo un error al intentar modificar el producto. Intente de nuevo más tarde'
        isCancelButton={false}
        textYes='Regresar'
        estatico
      />
      <CustomModal
        title='Producto modificado exitosamente'
        showModal={showModalSuccess}
        setShowModal={setShowModalSuccess}
        text='Se ha modificado el producto exitosamente. Vuelve a Inicio para seguir comprando'
        onYes={() => {
          navigate('/')
        }}
        onNo={() => {
          navigate('/')
        }}
        isCancelButton={false}
        textYes='Volver a Inicio'
      />
    </>
  )
}

export default EditProduct
