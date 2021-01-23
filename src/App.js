import React, {useEffect, useState} from 'react';
import Movie from './components/Movie';

import './App.css';

const APIKEY = "3295aa180ac0fc06694b2928be49210f";
const FEATURED_API = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${APIKEY}&language=ru&page=`;

const SEARCH_API = `https://api.themoviedb.org/3/search/movie?&api_key=${APIKEY}&query=`;

function App() {
  const [movies, setMovies] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  //const [nextMovies, setNextMovies] = useState(() => { return [] });

  //let useAPI = FEATURED_API;

  /*function pager() {
    var p = 1;
    return function() {
      p++;
      return p;
    }
  }*/

  //var nextPage = pager();

  useEffect(() => {
    getMovies(FEATURED_API + 1);
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isFetching) return;
    //fetchMoreListItems(page);
    getMovies(FEATURED_API + page, true);
  }, [isFetching]);

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
    console.log('Загружаем еще');
    setIsFetching(true);
  }

  const getMovies = (API, pager = false) => {
    fetch(API)
    .then((res) => res.json())
    .then((data) => {
      //console.log(data);
      setPage((prevState) => { return prevState+1 });
      if(pager === true) {
        console.log(data.results);
        //return data.results;
        //setNextMovies(prevState => {return data.results});
        setMovies(prevState => ([...prevState, ...data.results]));
        setIsFetching(false);
      } else {
        setMovies(data.results);
      }
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
      <nav>
        <ul className="menu">
          <li><a>Новинки</a></li>
          <li><a>Популярные</a></li>
          <li><a></a></li>
        </ul>
      </nav>
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
      {isFetching && 'Загружаю еще фильмы...'}
    </main>
  </>
  );
}

export default App;
