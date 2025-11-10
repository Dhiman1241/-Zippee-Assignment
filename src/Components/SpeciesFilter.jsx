const SpeciesFilter = ({ homeworldSpecies, value, onChange }) => {
  return (
    <div className="relative">
      <select 
        className="w-full sm:w-48 appearance-none px-4 py-2 pr-10 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200 bg-white text-gray-700"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Filter by Species</option>
        {homeworldSpecies.length > 0 && homeworldSpecies.map((species, i) => (
          <option key={i} value={species.name}>{species.name}</option>
        ))}
      </select>
    </div>
  );
};

export default SpeciesFilter;

