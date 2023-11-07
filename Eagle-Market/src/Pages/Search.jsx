import CustomModal from '@/Components/CustomModal/CustomModal'
import SearchCardsContainer from '@/Components/SearchCardsContainer/SearchCardsContainer'
import useProductsContext from '@/Context/ProductsContext/useProductsContext'
import { useEffect, useState } from 'react'
import { Slider } from '@mui/material/index'

const Search = () => {
  const { products, setProducts, advancedSearch, setAdvancedSearch } = useProductsContext()
  const [loaded, setLoaded] = useState(false)
  const [showModalFailure, setShowModalFailure] = useState(false)

  const [selectedCategories, setSelectedCategories] = useState([])
  const [allCategories, setAllCategories] = useState(true)
  const [sliderValue, setSliderValue] = useState([0, 1000])

  useEffect(() => {
    console.log('Getting')
    const getProducts = fetch('https://eagle-market.onrender.com/items', {
      method: 'GET'
    })
    getProducts.then((result) => {
      return result.json()
    })
      .then((result) => {
        console.log(result)
        setLoaded(true)
        setProducts(result)
      })
      .catch(e => {
        console.log(e)
        setShowModalFailure(true)
      })
  }, [setProducts])

  // const categoriesDict = {}
  const categoriesArray = []
  for (const element of products) {
    if (!categoriesArray.includes(element.category)) {
      categoriesArray.push(element.category)
    }
  }

  return (
    <>
      <h2>Búsqueda avanzada</h2>
      <div className='form-check'>
        <input
          className='form-check-input' type='checkbox' id='allCategoriesCheckbox' onChange={() => {
            setAllCategories(!allCategories)
          }}
          checked={allCategories}
        />
        <label className='form-check-label' htmlFor='allCategoriesCheckbox'>
          Todas las categorías
        </label>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, 140px)' }}>
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
              />
              <label className='form-check-label' htmlFor={`category-${index}`}>
                {element}
              </label>
            </div>
          )
        })}
      </div>
      <Slider
        value={sliderValue}
        onChange={(event) => setSliderValue(event.target.value)}
        valueLabelDisplay='auto'
        min={0}
        max={1000}
        step={100}
      />
      <p>{sliderValue[0]}</p>
      <p>{sliderValue[1]}</p>

      {/* {selectedCategories.map((element, index) => <p key={index}>{element}</p>)} */}

      <CustomModal
        title='Error al cargar los productos'
        showModal={showModalFailure}
        setShowModal={setShowModalFailure}
        text='Hubo un error al intentar cargar los productos. Recargue la página para volver a intentarlo o vuelva más tarde'
        isCancelButton={false}
        textYes='Regresar'
        estatico
      />
      <input
        type='text'
        value={advancedSearch}
        onChange={(event) => setAdvancedSearch(event.target.value)}
      />
      <SearchCardsContainer products={products} loaded={loaded} search={advancedSearch} selectedCategories={selectedCategories} allCategories={allCategories} prices={sliderValue} />
    </>
  )
}

export default Search
