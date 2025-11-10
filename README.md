# Zippee — Star Wars Characters (React + Vite)

This repository contains a small React application built with Vite that displays Star Wars characters fetched from the SWAPI (https://swapi.dev/). The UI is implemented with Tailwind CSS and includes search, pagination, a details modal, and a few UX improvements.

## Quick start — run locally

Prerequisites:
- Node.js (v16+ recommended)

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Open the app in your browser (Vite typically serves at http://localhost:5173).

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Lint the project:

```bash
npm run lint
```

## What I implemented

- Data fetching from SWAPI (`https://swapi.dev/api/people`) using `axios`.
- Paginated listing of characters using `react-paginate` and the SWAPI `page` parameter.
- Search box to query characters by name (uses SWAPI's `search` parameter).
- Species dropdown populated from SWAPI's `/species` endpoint (UI filter).
- Details modal for each character (`src/Components/Modal.jsx`) that:
  - Fetches and displays the character's homeworld details.
  - Shows formatted creation date using `moment`.
  - Provides accessible focus handling and Escape-to-close behavior.
- Client-side favorites (add/remove) stored in-memory during the session (implemented with a `Set`).
- Loading and error states with retry button.
- Responsive grid layout with images (placeholder images from `picsum.photos` seeded by character name).
- Basic species-based color styling for each card.

Key files:
- `src/Components/Cards.jsx` — main list, search, pagination, favorites, filter UI.
- `src/Components/Modal.jsx` — details modal and homeworld fetch logic.
- `src/Components/Loader.jsx` — small loading spinner component.

## Bonus features

- Favorites toggle on each card (keeps state during session).
- Species dropdown (populated from the API) and species-colored cards for visual grouping.
- Accessibility niceties:
  - Focus management: modal close button is focused on open.
  - Escape key closes the modal.
  - Buttons and controls have accessible labels where applicable.

## Trade-offs & design choices

- API design / filtering limitations: SWAPI exposes endpoints and a `search` parameter, but it does not support filtering people directly by species/homeworld name via query parameters. The current species dropdown sets a UI filter value; to filter accurately by species or homeworld we'd need either:
  - An additional client-side step to fetch all pages and filter locally (costly for larger datasets), or
  - Resolve species/homeworld resource URLs first (via `/species` or resource lookups) and then fetch matching people (requires extra requests and mapping).

- Pagination: The app uses SWAPI's server-side pagination (pages from the API) via `react-paginate`. This keeps bandwidth small but means we cannot combine server-side pagination with arbitrary client-side filters without additional requests.

- State persistence: Favorites are stored in memory (a `Set`) and will be lost on page refresh. Persisting to `localStorage` or a backend would be an easy enhancement.

- Caching & performance: No intensive caching is implemented. For better UX and fewer API calls we could cache species/homeworld responses and use request de-duplication or a small in-memory cache.

- Error handling: The app shows a simple error message and a retry button. For production, consider finer-grained error categories, exponential backoff, and user-friendly error details.

- Accessibility: Basic keyboard accessibility is implemented for the modal, but additional improvements are possible (e.g., ARIA announcements, focus trap inside modal, better contrast verification).

## Potential improvements / next steps

- Persist favorites to `localStorage` and provide a favorites view.
- Add unit tests for components and API utilities.
- Improve species/homeworld filtering by resolving resource URLs and performing server-assisted queries or client-side filtering with caching.
- Add skeleton loading states for faster perceived performance.

## Notes

- The app uses these main dependencies: `axios`, `react-paginate`, `tailwindcss`, and `moment` (for date formatting in the modal).
- Run `npm run dev` and open the site in the browser to explore the features.

If you'd like, I can:
- Persist favorites to `localStorage`.
- Implement a robust species/homeworld filter (with resource resolution and caching).
- Add a small test suite (Jest/React Testing Library) for `Cards` and `Modal`.

---

If you want any of the improvements above, tell me which one to prioritize and I'll implement it next.
