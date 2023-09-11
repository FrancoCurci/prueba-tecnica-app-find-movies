
import './App.css'
import { useEffect, useState, useRef, useCallback } from 'react'
import { MoviesRender } from './components/Movies.jsx'
import { CustomMovies } from './hooks/useMovies'
import debounce from 'just-debounce-it'

function useSearch() {
  const [search, updateSearch] = useState('')
  const [error, setError] = useState('')
  const firstRender = useRef(true)


  useEffect(() => {

    if (firstRender.current) {
      firstRender.current = search === ''
      return
    }
    if (search === '') {
      setError('Error al buscar una pelicula')
      return
    }
    if (search.match(/^\d+$/)) {
      setError('No se puede buscar una pelicula con numeros')
      return
    }
    if (search.length < 3) {
      setError('Ingrese mas de 3 caracteres para buscar una pelicula')
      return
    }
    setError(null)

  }, [search])

  return { search, updateSearch, error }

}

function App() {
  const [sort, setsort] = useState(false)
  const { search, updateSearch, error } = useSearch()
  const { movies, getMovies, loading } = CustomMovies({ search, sort });
  const debouncedGetMovies = useCallback(debounce(search => { console.log(search); getMovies(search) }, 2000), [])
  //const inputRef = useRef()

  const handleSubmit = (e) => {
    e.preventDefault()
    //const { title } = Object.fromEntries(new FormData(e.target))
    //const value = inputRef.current.value
    getMovies({ search })

  }
  const HandleChange = (e) => {
    const newSearch = e.target.value
    updateSearch(newSearch)
    debouncedGetMovies({ search: newSearch })
  }
  const handleSort = () => {
    setsort(!sort)
  }



  return (
    <div className='page'>


      <header>
        <h1>Buscador de peliculas</h1>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-Content">
            <input
              onChange={HandleChange}
              value={search}
              type="text"
              placeholder='Star wards, Lord of the Ring, ...'
              /*ref={inputRef}*/
              name='title'
              style={{
                border: '1px solid transparent',
                borderColor: error ? 'red' : 'transparent'
              }}
            />
            <input
              type="checkbox"
              onChange={handleSort}
              checked={sort} />
            <button>Buscar</button>
          </div>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </header>


      <main>
        {
          loading
            ? (<p>...Cargando</p>)
            : (<MoviesRender arrayMovies={movies} />)
        }

      </main>
    </div >
  )
}

export default App
