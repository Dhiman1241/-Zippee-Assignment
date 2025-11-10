const SearchBar = ({ query, onQueryChange }) => {
  return (
    <div className="relative">
      <input
        type="search"
        placeholder="Search characters..."
        value={query}
        className="w-full sm:w-64 px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200 bg-white"
        onInput={(e) => onQueryChange(e.target.value)}
      />
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
      </svg>
    </div>
  );
};

export default SearchBar;

