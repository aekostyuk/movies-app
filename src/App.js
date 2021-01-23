import React, {useEffect, useState} from 'react';
import Movie from './components/Movie';

import './App.css';

const APIKEY = "3295aa180ac0fc06694b2928be49210f";
const FEATURED_API = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${APIKEY}&language=ru&page=1`;

const SEARCH_API = `https://api.themoviedb.org/3/search/movie?&api_key=${APIKEY}&query=`;

function App() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getMovies(FEATURED_API);
  }, []);


  const getMovies = (API) => {
    fetch(API)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      setMovies(data.results);
    });
  }
  
  const handleOnSubmit = (e) => {
    e.preventDefault();

    if(searchTerm) {
      getMovies(SEARCH_API + searchTerm);

      setSearchTerm('');
    }
  }

  const handleOnChange = (e) => {
    setSearchTerm(e.target.value);
  }
  
  return (
  <>
    <header>
      <form onSubmit={handleOnSubmit}>
        <input  className="search" type="search"
        placeholder="Поиск..."
        value={searchTerm}
        onChange={handleOnChange}/>
      </form>
    </header>
    <main id="main">
      
      {movies.length > 0 && movies.map(movie => (
          <Movie key={movie.id} {...movie}/>
        ))}
        
    </main>
  </>
  );
}

export default App;
