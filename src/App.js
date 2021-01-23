import React, {useEffect, useState} from 'react';
import Movie from './components/Movie';

import './App.css';

const APIKEY = "3295aa180ac0fc06694b2928be49210f";
const FEATURED_API = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${APIKEY}&language=ru&page=`;

const SEARCH_API = `https://api.themoviedb.org/3/search/movie?&api_key=${APIKEY}&query=`;

function App() {
  const [movies, setMovies] = useState(() => { return [] });
  const [isFetching, setIsFetching] = useState(() => { return false });
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(() => { return 1 });
  const [nextMovies, setNextMovies] = useState(() => { return [] });

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
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isFetching) return;
    
    
    fetchMoreListItems(page);
  }, [isFetching]);

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
    console.log('Загружаем еще');
    setIsFetching(true);
  }

  const fetchMoreListItems = (page) => {
    //setMovies();
    //getMovies(FEATURED_API + page);
    //nextPage++;
    
    getMovies(FEATURED_API + page, true);
    
    console.log(page);
    setTimeout(() => {
      console.log(nextMovies);
      setMovies(prevState => ([...prevState, ...nextMovies]));
      
      setIsFetching(false);
    }, 200);
  }

  const getMovies = (API, pager = false) => {
    fetch(API)
    .then((res) => res.json())
    .then((data) => {
      //console.log(data);
      setPage((prevState) => { return prevState+1 });
      if(pager === true) {
        setNextMovies(prevState => {return data.results});
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
