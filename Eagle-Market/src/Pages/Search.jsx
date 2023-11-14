import CustomModal from '@/Components/CustomModal/CustomModal'
import SearchCardsContainer from '@/Components/SearchCardsContainer/SearchCardsContainer'
import useProductsContext from '@/Context/ProductsContext/useProductsContext'
import { useEffect, useState } from 'react'
import Slider from '@mui/material/Slider'
import { useParams, useNavigate } from 'react-router-dom'
import '@/Styles/Search.scss'

const Search = () => {
  const navigate = useNavigate()
  const { products, setProducts, advancedSearch, setAdvancedSearch } = useProductsContext()
  const [loaded, setLoaded] = useState(false)
  const [showModalFailure, setShowModalFailure] = useState(false)

  const [selectedCategories, setSelectedCategories] = useState([])
  const [allCategories, setAllCategories] = useState(true)
  const [sliderValue, setSliderValue] = useState([0, 1000])

  const { text } = useParams()

  useEffect(() => {
    if (text) {
      setSelectedCategories([text])
      setAllCategories(false)
    }
    const getProducts = fetch('https://eagle-market.onrender.com/items', {
      method: 'GET'
    })
    getProducts.then((result) => {
      return result.json()
    })
      .then((result) => {
        setLoaded(true)
        setProducts(result)
      })
      .catch(e => {
        setShowModalFailure(true)
      })
    window.scrollTo(0, 0)
  }, [setProducts, text])

  const categoriesArray = []
  for (const element of products) {
    if (!categoriesArray.includes(element.category)) {
      categoriesArray.push(element.category)
    }
  }
  categoriesArray.sort()

  const resetFilters = () => {
    setAllCategories(true)
    setAdvancedSearch('')
    setSliderValue([0, 1000])
    navigate('/search')
  }

  return (
    <div className='page-container'>
      <h2>Búsqueda avanzada</h2>
      <div className='search-page-container'>
        <div className='filters-container form-container'>
          <div className='form-floating general-search'>
            <input
              type='text'
              className='form-control'
              id='general-search'
              placeholder='Busca en todo Eagle Market'
              value={advancedSearch}
              onChange={(event) => setAdvancedSearch(event.target.value)}
            />
            <label htmlFor='general-search'>Busca en todo Eagle Market</label>
          </div>
          <div className='form-check form-check--spaced'>
            <label className='form-check-label' htmlFor='allCategoriesCheckbox'>
              Todas las categorías
            </label>
            <input
              className='form-check-input' type='checkbox' id='allCategoriesCheckbox' onChange={() => {
                setAllCategories(!allCategories)
              }}
              checked={allCategories}
            />
          </div>
          <div className='all-categories-container'>
            {categoriesArray.map((element, index) => {
              return (
                <div key={index} className='form-check'>
                  <input
                    className='form-check-input' type='checkbox' id={`category-${index}`} onChange={() => {
                      if (selectedCategories.includes(element)) {
                        setSelectedCategories(selectedCategories.filter((category) => category !== element))
                      } else {
                        const newCategories = [...selectedCategories]
                        newCategories.push(element)
                        setSelectedCategories(newCategories)
                      }
                    }}
                    disabled={allCategories}
                    defaultChecked={element === text}
                  />
                  <label className='form-check-label' htmlFor={`category-${index}`}>
                    {element}
                  </label>
                </div>
              )
            })}
          </div>
          <h5 className='spaced'>Filtrar por precio</h5>
          <div className='slider-container'>
            <p>${sliderValue[0]}</p>
            <Slider
              value={sliderValue}
              onChange={(event) => setSliderValue(event.target.value)}
              valueLabelDisplay='auto'
              min={0}
              max={1000}
              step={100}
              color='success'
            />
            <p>${sliderValue[1] === 1000 ? '1000+' : sliderValue[1]}</p>
          </div>
          <button onClick={resetFilters} className='btn btn-outline-secondary spaced'>Restablecer filtros</button>
        </div>
        <div className='products-container'>
          {/* <h3 className='spaced spaced--top'>Productos que coinciden con tu búsqueda</h3> */}
          <SearchCardsContainer products={products} loaded={loaded} search={advancedSearch} selectedCategories={selectedCategories} allCategories={allCategories} prices={sliderValue} categoriesArray={categoriesArray} />
        </div>
        <CustomModal
          title='Error al cargar los productos'
          showModal={showModalFailure}
          setShowModal={setShowModalFailure}
          text='Hubo un error al intentar cargar los productos. Recargue la página para volver a intentarlo o vuelva más tarde'
          isCancelButton={false}
          textYes='Regresar'
          estatico
        />
      </div>
    </div>
  )
}

export default Search
