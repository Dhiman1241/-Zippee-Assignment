import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import Loader from './Loader.jsx';
import ReactPaginate from 'react-paginate';
import Modal from './Modal.jsx';


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
  const [pageCount, setPageCount] = useState(Math.ceil(totalRecords / itemPerPage)); 
  const [query, setQuery] = useState('');
  const [homeworldSpecies, setHomeworldSpecies] = useState({});
  const [homeWorldSpeciesFilter, setHomeWorldSpeciesFilter] = useState('');


  async function fetchData() {
    setLoading(true);

    let apiUrl = `https://swapi.dev/api/people`;
    const queryParams = [];
    if(currentPage) {
      queryParams.push(`page=${currentPage}`);
    }
    if(query) {
      queryParams.push(`search=${encodeURIComponent(query)}`);
    }
    if (homeWorldSpeciesFilter) {
      queryParams.push(`homeworld=${encodeURIComponent(homeWorldSpeciesFilter)}`);
    }
    if (queryParams.length > 0) {
      apiUrl += `?${queryParams.join('&')}`;
    }

    try {
      // SWAPI supports page query param. Pages are 1-indexed.
      const res = await axios.get(apiUrl);
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

  async function fetchHomeworldSpecies() {
    let url = `https://swapi.dev/api/species`;

    
    try {
      // SWAPI supports page query param. Pages are 1-indexed.
      const res = await axios.get(url);
      setHomeworldSpecies(res.data.results || []);
    } catch (err) {
      setError("Failed to fetch data. Please try again later.");
      console.error("API error:", err.message);
    } finally {
      setLoading(false);
    }
  }



  useEffect(() => {
    
    fetchData();
  }, [currentPage, query, homeWorldSpeciesFilter]);

  useEffect(() => {
    fetchHomeworldSpecies();
  }, []);

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
    const newPage = (event?.selected ?? 0) + 1;
    setCurrentPage(newPage);
  }

  const openModal = (person) => setModalPerson(person);
  const closeModal = () => setModalPerson(null);


  const speciesColors = {
    1: 'bg-blue-200',
    2: 'bg-green-200',
    3: 'bg-brown-200',
    4: 'bg-purple-200',
    6: 'bg-gray-200',
    7: 'bg-yellow-200',
    8: 'bg-cyan-200',
    9: 'bg-purple-200',
    10: 'bg-indigo-200',
    11: 'bg-emerald-200',
    default: 'bg-gray-200',
  };

  return (
    <div className="min-h-screen py-10 px-4 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            Star Wars <span className="text-indigo-600">Characters</span>
          </h1>
          <div className="w-full sm:w-auto flex gap-2">
            <div className="relative">
              <input
                type="search"
                placeholder="Search characters..."
                className="w-full sm:w-64 px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200 bg-white"
                onInput={(e) => {
                  const query = e.target.value;
                  setQuery(query);
                }}
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="mt-3 sm:mt-0 sm:ml-3">
              <div className="relative">
                <select 
                  className="w-full sm:w-48 appearance-none px-4 py-2 pr-10 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200 bg-white text-gray-700"
                  onChange={(e) => {
                    // Add your filter logic here
                    setHomeWorldSpeciesFilter(e.target.value);
                    console.log(e.target.value);
                  }}
                >
                  <option value="">Filter by Species</option>
                  {homeworldSpecies.length > 0 && homeworldSpecies.map((species, i) => (
                    <option key={i} value={species.name}>{species.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
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

              { person }

              const speciesId = person?.species[0]?.split('/').slice(-2, -1)[0] || 'default'; // Extracting ID from species URL

              return (
                <article
                  key={id}
                  className={`relative]} rounded-2xl overflow-hidden shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300`}
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
                      className={`absolute right-3 top-3 p-2 rounded-full backdrop-blur-sm transition ${isFav ? 'bg-indigo-600 text-white' : 'bg-white/30 text-white'
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

                  <div className={`p-4 sm:p-5 ${speciesColors[speciesId]}`}>
                    <div className="flex items-center justify-between">

                      <button
                        onClick={() => openModal(person)}
                        className="px-3 py-1 text-sm bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100 transition cursor-pointer"
                        aria-haspopup="dialog"
                      >
                        Details
                      </button>

                      <a
                        href={person.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-gray-800 text-white text-sm rounded-md hover:bg-gray-900 transition cursor-pointer"
                      >
                        View Profile
                      </a>

                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {modalPerson && <Modal modalPerson={modalPerson} closeModal={closeModal} closeBtnRef={closeBtnRef} />}

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