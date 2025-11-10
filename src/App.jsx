import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import './App.css'
import Cards from './Components/Cards.jsx'

function App() {
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
  const [homeworldSpecies, setHomeworldSpecies] = useState([]);
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
    <Cards
      data={data}
      loading={loading}
      error={error}
      modalPerson={modalPerson}
      favs={favs}
      closeBtnRef={closeBtnRef}
      totalRecords={totalRecords}
      currentPage={currentPage}
      pageCount={pageCount}
      query={query}
      setQuery={setQuery}
      homeworldSpecies={homeworldSpecies}
      homeWorldSpeciesFilter={homeWorldSpeciesFilter}
      setHomeWorldSpeciesFilter={setHomeWorldSpeciesFilter}
      toggleFav={toggleFav}
      pageChanged={pageChanged}
      openModal={openModal}
      closeModal={closeModal}
      speciesColors={speciesColors}
    />
  )
}

export default App
