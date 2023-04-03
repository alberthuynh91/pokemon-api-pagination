import { useState, useEffect } from 'react';
import Pokemon from './components/Pokemon';
import PageNumbers from './components/PageNumbers';
import { sortAlphabeticallyBy } from './utils';
import { LIMIT } from './constants';
import './App.css';

function App() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ results: [] });
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    fetch('https://pokeapi.co/api/v2/pokemon-species/')
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        setData({
          ...data,
          results: sortAlphabeticallyBy('name', data.results),
        });
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app">
      <div className="pokemon-container">
        {data.results.map((item) => {
          return <Pokemon key={item.url} {...item} />;
        })}
      </div>
      <PageNumbers
        data={data}
        setData={setData}
        page={page}
        setPage={setPage}
      />
      <div>Total: {data.count}</div>
    </div>
  );
}

export default App;
