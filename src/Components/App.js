import React, { useReducer, useEffect } from 'react';
import '../App.css';
import Header from './header';
import spinner from '../assets/ajax-loader.gif';
import { initialState, reducer } from '../store/index';
import Movie from './movie';
import Search from './search';
import axios from 'axios';

const MOVIE_API = 'https://omdbapi.com/?s=man&apikey=d6966d1d';

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    axios.get(MOVIE_API)
    .then(jsonResponse => {
      dispatch({
        type: "SEARCH_MOVIES_SUCCESS",
        payload: jsonResponse.data.Search
      })
    })
  }, [])

  const search = searchValue => {
   dispatch({
     type: "SEARCH_MOVIES_REQUEST"
   })

    axios(`https://omdbapi.com/?s=${searchValue}&apikey=d6966d1d`)
    .then(response => response.json())
    .then(jsonResponse => {
      if (jsonResponse.Response === 'True') {
        dispatch({
          type: "SEARCH_MOVIES_SUCCESS",
          payload: jsonResponse.Search
        })
      } else {
        dispatch({
          type: "SEARCH_MOVIES_FAIL",
          error: jsonResponse.Error
        })
      }
    });
  };

  const { movies, errorMessage, loading } = state;

  const retrievedMovies =
    loading && !errorMessage ? (
      <img className="spinner" src={spinner} alt="Loading spinner" />
    ) : errorMessage ? (
      <div className="errorMessage">{errorMessage}</div>
    ) : (
      movies.map((movie, index) => (
        <Movie key={`${index}-${movie.Title}`} movie={movie} />
      ))
    );

  return (
    <div className="App">
      <div className="m-container">
        <Header text="HOOKED" />

        <Search search={search} />

        <p className="App-intro">Sharing our favorite movies</p>

        <div className="movies">{retrievedMovies}</div>
      </div>
    </div>
  );
};

export default App;
