// Map of species to color schemes
const speciesColorMap = {
  'Human': {
    accent: 'from-blue-500',
    background: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700'
  },
  'Droid': {
    accent: 'from-gray-500',
    background: 'bg-gray-50',
    border: 'border-gray-200',
    text: 'text-gray-700'
  },
  'Wookiee': {
    accent: 'from-amber-600',
    background: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700'
  },
  'Rodian': {
    accent: 'from-green-500',
    background: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-700'
  },
  'Hutt': {
    accent: 'from-emerald-500',
    background: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700'
  },
  'Yoda\'s species': {
    accent: 'from-green-600',
    background: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-700'
  },
  'Trandoshan': {
    accent: 'from-yellow-500',
    background: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-700'
  },
  'Mon Calamari': {
    accent: 'from-cyan-500',
    background: 'bg-cyan-50',
    border: 'border-cyan-200',
    text: 'text-cyan-700'
  },
  'Twi\'lek': {
    accent: 'from-purple-500',
    background: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-700'
  },
  // Default color scheme for unknown species
  'default': {
    accent: 'from-indigo-500',
    background: 'bg-indigo-50',
    border: 'border-indigo-200',
    text: 'text-indigo-700'
  }
};

/**
 * Get color scheme for a given species
 * @param {string} species - The species name
 * @returns {Object} Color scheme object with accent, background, border, and text colors
 */
export const getSpeciesColors = (species) => {
  return speciesColorMap[species] || speciesColorMap.default;
};

export default speciesColorMap;