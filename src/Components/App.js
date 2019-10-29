import React, { useReducer, useEffect } from 'react';
import '../App.css';
import Header from './Header/header';
import Movie from './Movie/movie';
import Search from './Search/search';

const MOVIE_API = 'https://omdbapi.com/?s=man&apikey=d6966d1d';

const initialState = {
  loading: true,
  movies: [],
  errorMessage: null
}

const reducer = (state, action) => {
  switch (action.type) {
    case "SEARCH_MOVIES_REQUEST":
      return {
        ...state,
        loading: true,
        errorMessage: null
      };
    case "SEARCH_MOVIES_SUCCESS":
      return {
        ...state,
        loading: false,
        movies: action.payload
      };
    case "SEARCH_MOVIES_FAIL":
      return {
        ...state,
        loading: false,
        errorMessage: action.error
      };
    default:
      return state;
  }
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    fetch(MOVIE_API)
    .then(response => response.json())
    .then(jsonResponse => {
      dispatch({
        type: "SEARCH_MOVIES_SUCCESS",
        payload: jsonResponse.Search
      })
    })
  }, [])

  const search = searchValue => {
   dispatch({
     type: "SEARCH_MOVIES_REQUEST"
   })

    fetch(`https://omdbapi.com/?s=${searchValue}&apikey=d6966d1d`)
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

  return (
    <div className="App">
      <Header text="HOOKED" />
      <Search search={search} />
      <p className="App-intro">Sharing our favorite movies</p>
      <div className="movies">
        {loading && !errorMessage ? (
          <span>loading... </span>
        ) : errorMessage ? (
          <div className="errorMessage">{errorMessage}</div>
        ) : (
          movies.map((movie, index) => (
            <Movie key={`${index}-${movie.Title}`} movie={movie} />
          ))
        )}
      </div>
    </div>
  );
}

export default App;
