import React, { useState, useEffect } from 'react';
import '../App.css';
import Header from './Header/header';
import Movie from './Movie/movie';
import Search from './Search/search';

const MOVIE_API = 'https://omdbapi.com/?s=man&apikey=d6966d1d';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    fetch(MOVIE_API)
    .then(response => response.json())
    .then(jsonResponse => {
      setMovies(jsonResponse.Search);
      setLoading(false)
    })
  }, [])

  const search = searchValue => {
    setLoading(true);
    setErrorMessage(null);

    fetch(`https://omdbapi.com/?s=${searchValue}&apikey=d6966d1d`)
    .then(response => response.json())
    .then(jsonResponse => {
      if (jsonResponse.Response === 'True') {
        setMovies(jsonResponse.Search);
        setLoading(false);
      } else {
        setErrorMessage(jsonResponse.Error);
        setLoading(false);
      }
    });
  }

  return (
    <div className='App'>
      <Header text="Hooked" />
      <Search search={search} />
      <p className='App-intro'> Sharing our favorite Movies</p>
      <div className='movies'>
        {loading & !errorMessage ? (
          <span>loading...</span>
        ) : errorMessage ? (
          <div className='errorMessage'>{errorMessage}</div>
        ) : (movies.map((movie, index) => (
          <Movie key={`${index}-${movie.Title}`} movie={movie} />
        )))}
      </div>
    </div>
  )
}

export default App;
