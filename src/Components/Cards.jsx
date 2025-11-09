// ...existing code...
import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import Loader from './Loader.jsx';
import ReactPaginate from 'react-paginate';


const Cards = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalPerson, setModalPerson] = useState(null);
  const [favs, setFavs] = useState(new Set());
  const closeBtnRef = useRef(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(12);
  const [pageCount, setPageCount] =useState(Math.ceil(totalRecords / itemPerPage)); // Assuming 10 records per page


  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // SWAPI supports page query param. Pages are 1-indexed.
        const res = await axios.get(`https://swapi.dev/api/people/?page=${currentPage}`);
        setData(res.data.results || []);
        if (res.data.count) {
          const pgCount = Math.ceil(res.data.count / itemPerPage);
          setPageCount(pgCount);
          setTotalRecords(res.data.count);
        }
      } catch (err) {
        setError("Failed to fetch data. Please try again later.");
        console.error("API error:", err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [currentPage, itemPerPage]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') setModalPerson(null);
    }
    if (modalPerson) {
      document.addEventListener('keydown', onKey);
      // prevent background scroll
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      // focus close button for accessibility
      setTimeout(() => closeBtnRef.current?.focus(), 0);
      return () => {
        document.removeEventListener('keydown', onKey);
        document.body.style.overflow = prev;
      };
    }
  }, [modalPerson]);

  const toggleFav = (id) => {
    setFavs(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const pageChanged = (event) => {
    // ReactPaginate provides 0-indexed selected value
    const newPage = (event?.selected ?? 0) + 1;
    setCurrentPage(newPage);
  }

  const openModal = (person) => setModalPerson(person);
  const closeModal = () => setModalPerson(null);

  useEffect(() => {
    console.log("Current Page:", currentPage);
  },[currentPage]);

  return (
    <div className="min-h-screen py-10 px-4 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            Star Wars <span className="text-indigo-600">Characters</span>
          </h1>
        </header>

        {loading && (
          <div className="flex justify-center py-12">
            <Loader />
          </div>
        )}

        {error && (
          <div className="text-center text-red-600 font-semibold mt-6">
            <p>{error}</p>
            <div className="mt-4 flex justify-center gap-3">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 transition"
                aria-label="Retry loading data"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data.map((person) => {
              const id = person.url || person.name;
              const isFav = favs.has(id);

              return (
                <article
                  key={id}
                  className="relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="relative h-44 sm:h-48 overflow-hidden">
                    <img
                      src={`https://picsum.photos/seed/${encodeURIComponent(person.name)}/600/400`}
                      alt={`${person.name} portrait`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute left-4 bottom-3 text-white">
                      <h2 className="text-lg sm:text-xl font-semibold leading-tight drop-shadow">
                        {person.name}
                      </h2>
                      <div className="mt-1 flex gap-2 items-center">
                        <span className="text-xs bg-white/10 backdrop-blur px-2 py-1 rounded-md">
                          {person.gender ?? 'unknown'}
                        </span>
                        <span className="text-xs bg-white/10 backdrop-blur px-2 py-1 rounded-md">
                          {person.birth_year ?? '—'}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleFav(id)}
                      aria-pressed={isFav}
                      className={`absolute right-3 top-3 p-2 rounded-full backdrop-blur-sm transition ${
                        isFav ? 'bg-indigo-600 text-white' : 'bg-white/30 text-white'
                      }`}
                      title={isFav ? 'Remove favorite' : 'Add to favorites'}
                    >
                      {isFav ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                          <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 18.657 3.172 11.83a4 4 0 010-5.656z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.172 5.172a4 4 0 015.656 0L12 8.343l3.172-3.171a4 4 0 015.656 5.656L12 21.657 3.172 11.83a4 4 0 010-5.656z" />
                        </svg>
                      )}
                    </button>
                  </div>

                  <div className="p-4 sm:p-5 bg-white">
                    <div className="flex items-center justify-between">
                      {/* <div className="text-sm text-gray-700">
                        <p className="font-medium">Height: <span className="text-gray-600 font-normal">{person.height} cm</span></p>
                      </div> */}

                      <div className="flex gap-2">
                        <button
                          onClick={() => openModal(person)}
                          className="px-3 py-1 text-sm bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100 transition"
                          aria-haspopup="dialog"
                        >
                          Details
                        </button>

                        <a
                          href={person.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-gray-800 text-white text-sm rounded-md hover:bg-gray-900 transition"
                        >
                          View Profile
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {modalPerson && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div
              className="absolute inset-0 bg-black/50 transition-opacity"
              onClick={closeModal}
              aria-hidden="true"
            />
            <div className="relative bg-white rounded-xl overflow-hidden shadow-2xl max-w-2xl w-full mx-auto transform transition-all">
              <div className="relative">
                <img
                  src={`https://picsum.photos/seed/${encodeURIComponent(modalPerson.name)}/1200/600`}
                  alt={`${modalPerson.name} hero`}
                  className="w-full h-44 sm:h-56 object-cover"
                />
                <button
                  ref={closeBtnRef}
                  onClick={closeModal}
                  className="absolute right-3 top-3 p-2 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow focus:outline-none"
                  aria-label="Close details"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                    <path fillRule="evenodd" d="M6.293 6.293a1 1 0 011.414 0L10 8.586l2.293-2.293a1 1 0 011.414 1.414L11.414 10l2.293 2.293a1 1 0 01-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 01-1.414-1.414L8.586 10 6.293 7.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              <div className="p-6">
                <h2 id="modal-title" className="text-2xl font-semibold text-gray-900">{modalPerson.name}</h2>
                <p className="mt-2 text-sm text-gray-600">{modalPerson.birth_year} • {modalPerson.gender}</p>

                <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-700">
                  <div>
                    <p className="font-medium text-gray-800">Height</p>
                    <p className="mt-1">{modalPerson.height} cm</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Mass</p>
                    <p className="mt-1">{modalPerson.mass} kg</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Eye Color</p>
                    <p className="mt-1">{modalPerson.eye_color}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Hair Color</p>
                    <p className="mt-1">{modalPerson.hair_color}</p>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition"
                  >
                    Close
                  </button>
                  <a
                    href={modalPerson.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                  >
                    Open on SWAPI
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-8">
        <div className="flex items-center justify-between max-w-6xl mx-auto px-4">
          <div className="text-sm text-gray-600">{`Showing page ${currentPage} of ${pageCount} • ${totalRecords} results`}</div>
          <ReactPaginate
            breakLabel="..."
            nextLabel="›"
            onPageChange={pageChanged}
            pageRangeDisplayed={5}
            marginPagesDisplayed={1}
            pageCount={pageCount}
            previousLabel="‹"
            renderOnZeroPageCount={null}
            forcePage={Math.max(0, currentPage - 1)}
            containerClassName="flex items-center justify-center gap-2"
            pageClassName="inline-block"
            pageLinkClassName="px-3 py-1 rounded-md text-sm text-gray-700 hover:bg-indigo-50 transition"
            previousClassName="inline-block"
            previousLinkClassName="px-3 py-1 rounded-md text-sm text-gray-700 hover:bg-indigo-50 transition"
            nextClassName="inline-block"
            nextLinkClassName="px-3 py-1 rounded-md text-sm text-gray-700 hover:bg-indigo-50 transition"
            breakClassName="inline-block"
            breakLinkClassName="px-3 py-1 text-gray-500"
            activeClassName="bg-indigo-600"
            activeLinkClassName="text-white"
            disabledClassName="opacity-40 pointer-events-none"
          />
        </div>
      </div>
    </div>
    

    
  );
};

export default Cards;
// ...existing code...