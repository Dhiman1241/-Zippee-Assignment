import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'
import Cards from './Components/Cards.jsx'

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favs, setFavs] = useState(new Set());
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(10);
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await axios.get(`https://swapi.dev/api/people/?page=${currentPage}`);
        
        // Fetch species data for each character
        const charactersWithSpecies = await Promise.all(
          (res.data.results || []).map(async (character) => {
            if (character.species && character.species.length > 0) {
              try {
                const speciesRes = await axios.get(character.species[0]);
                return { ...character, speciesName: speciesRes.data.name };
              } catch (speciesErr) {
                console.warn(`Could not fetch species for ${character.name}:`, speciesErr);
                return { ...character, speciesName: 'unknown' };
              }
            }
            // If no species URL, assume Human (like Luke, Leia, etc.)
            return { ...character, speciesName: 'Human' };
          })
        );

        setData(charactersWithSpecies);
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

  const toggleFav = (id) => {
    setFavs(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const onPageChange = (event) => {
    const newPage = (event?.selected ?? 0) + 1;
    setCurrentPage(newPage);
  };

  return (
    <div>
      <Cards
        data={data}
        loading={loading}
        error={error}
        favs={favs}
        onToggleFav={toggleFav}
        currentPage={currentPage}
        pageCount={pageCount}
        totalRecords={totalRecords}
        onPageChange={onPageChange}
      />
    </div>
  )
}

export default App
