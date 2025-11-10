import Loader from './Loader.jsx';
import ReactPaginate from 'react-paginate';
import Modal from './Modal.jsx';
import CharacterCard from './CharacterCard.jsx';
import SearchBar from './SearchBar.jsx';
import SpeciesFilter from './SpeciesFilter.jsx';

const Cards = ({
  data,
  loading,
  error,
  modalPerson,
  favs,
  closeBtnRef,
  totalRecords,
  currentPage,
  pageCount,
  query,
  setQuery,
  homeworldSpecies,
  homeWorldSpeciesFilter,
  setHomeWorldSpeciesFilter,
  toggleFav,
  pageChanged,
  openModal,
  closeModal,
  speciesColors,
}) => {

  return (
    <div className="min-h-screen py-10 px-4 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            Star Wars <span className="text-indigo-600">Characters</span>
          </h1>
          <div className="w-full sm:w-auto flex gap-2">
            <SearchBar query={query} onQueryChange={setQuery} />
            <div className="mt-3 sm:mt-0 sm:ml-3">
              <SpeciesFilter 
                homeworldSpecies={homeworldSpecies}
                value={homeWorldSpeciesFilter}
                onChange={setHomeWorldSpeciesFilter}
              />
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

              return (
                <CharacterCard
                  key={id}
                  person={person}
                  isFav={isFav}
                  onToggleFav={toggleFav}
                  onOpenModal={openModal}
                  closeBtnRef={closeBtnRef}
                  speciesColors={speciesColors}
                />
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