import { useRef, useState, useMemo, useCallback } from 'react'
import { searchMovies } from '../services/MoviesServices';

export function CustomMovies({ search, sort }) {
    const [movies, setMovies] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const beforeSearch = useRef()


    const getMovies = useCallback(
        async ({ search }) => {
            try {
                if (beforeSearch.current === search) return;

                beforeSearch.current = search
                setLoading(true)
                setError(null)
                const newMovies = await searchMovies({ search })
                setMovies(newMovies)
            } catch (error) {
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }, [search])

    const sortedMovies = useMemo(() => { return sort ? [...movies].sort((a, b) => a.title.localeCompare(b.title)) : movies }, [sort, movies])

    return { movies: sortedMovies, getMovies, loading, error }
}