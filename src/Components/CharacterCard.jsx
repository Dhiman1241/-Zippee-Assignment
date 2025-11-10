import Modal from './Modal.jsx';

const CharacterCard = ({ person, isFav, onToggleFav, onOpenModal, closeBtnRef, speciesColors }) => {
  const id = person.url || person.name;
  const speciesId = person?.species[0]?.split('/').slice(-2, -1)[0] || 'default';

  return (
    <article
      key={id}
      className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
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
          onClick={() => onToggleFav(id)}
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

      <div className={`p-4 sm:p-5 ${speciesColors[speciesId] || speciesColors.default}`}>
        <div className="flex items-center justify-between">
          <button
            onClick={() => onOpenModal(person)}
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
};

export default CharacterCard;

