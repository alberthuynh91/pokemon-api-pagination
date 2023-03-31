import { sortAlphabeticallyBy } from '../utils';
import { LIMIT } from '../constants';

// Generate list of fixed-length arrays based on number of page buttons per row
const getPages = (totalNumItems, numItemsPerPage, numPageBtnsPerRow) => {
  const totalNumRows = Math.ceil(totalNumItems / numItemsPerPage);
  const pageRows = {};
  let row = [];
  for (var i = 0; i < totalNumRows; i++) {
    const currentNum = i + 1;
    const currentRow = Math.ceil(currentNum / numPageBtnsPerRow);
    row.push(currentNum);
    if (currentNum % numPageBtnsPerRow === 0 || currentNum === totalNumRows) {
      pageRows[currentRow] = row;
      row = [];
    }
  }
  return pageRows;
};

const PageNumbers = (props) => {
  const { data, setData, page, setPage } = props;

  if (!data.count) return null;

  const totalNumPages = Math.ceil(data.count / 20);
  const pages = getPages(data.count, 20, 10); // divides total number of pages into rows of 10. ex: [[1,2,3,4,5,6,7,8,9,10], [11,12..]]
  const currentPageOfPages = Math.ceil(page / 10);

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
    const offset = (pageNumber - 1) * 20;
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
        setPage(Number(pageNumber));
      });
  };
  return (
    <div className="page-numbers-container">
      <div className="prev-next-wrapper">
        <button disabled={page === 1} onClick={handlePrev}>
          Prev
        </button>
        <span>{page}</span>
        <button disabled={page === totalNumPages} onClick={handleNext}>
          Next
        </button>
      </div>
      <div>
        {pages[currentPageOfPages].map((pageNum) => {
          return (
            <button value={pageNum} onClick={handlePage}>
              {pageNum}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PageNumbers;
