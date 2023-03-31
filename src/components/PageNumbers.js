import { sortAlphabeticallyBy } from '../utils';
import { LIMIT } from '../constants';

const PageNumbers = (props) => {
  const { data, setData, page, setPage } = props;

  if (!data.count) return null;

  const totalNumPages = Math.ceil(data.count / 20);

  const pages =
    totalNumPages - page > 9
      ? Array(totalNumPages)
          .fill()
          .map((_, i) => i)
          .slice(page - 1, page + 9)
      : Array(totalNumPages)
          .fill()
          .map((_, i) => i)
          .slice(totalNumPages - 10, totalNumPages);

  const handlePrev = () => {
    if (data.previous) {
      fetch(data.previous)
        .then((response) => response.json())
        .then((data) => {
          setData({
            ...data,
            // Note: Sorting the results of every API call is not very efficient. We should cache this computation or ask the API for the sorted data through request params.
            results: sortAlphabeticallyBy(data.results, 'name'),
          });
          setPage((pageNum) => pageNum - 1);
        });
    }
  };

  const handleNext = () => {
    const totalNumPages = Math.ceil(data.count / 20);

    if (data.next && page + 1 <= totalNumPages) {
      fetch(
        'https://pokeapi.co/api/v2/pokemon-species/?' +
          new URLSearchParams({
            offset: page * 20,
            limit: LIMIT,
          })
      )
        .then((response) => response.json())
        .then((data) => {
          setData({
            ...data,
            results: sortAlphabeticallyBy(data.results, 'name'),
          });
          setPage((pageNum) => pageNum + 1);
        });
    }
  };
  const handlePage = (event) => {
    const pageNumber = event.target.value;
    const offset = pageNumber * 20;

    fetch(
      'https://pokeapi.co/api/v2/pokemon-species/?' +
        new URLSearchParams({
          offset,
          limit: 20,
        })
    )
      .then((response) => response.json())
      .then((data) => {
        setData({
          ...data,
          results: sortAlphabeticallyBy(data.results, 'name'),
        });
        setPage(Number(pageNumber) + 1);
      });
  };
  return (
    <div className="page-numbers-container">
      {page > 1 && <button onClick={handlePrev}>Prev</button>}
      <span>{page}</span>
      {page < totalNumPages && <button onClick={handleNext}>Next</button>}
      <div>
        {pages.map((page) => {
          return (
            <button value={page} onClick={handlePage}>
              {page + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PageNumbers;
