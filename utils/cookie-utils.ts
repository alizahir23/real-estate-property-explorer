import Cookies from "js-cookie";

interface SavedSearch {
  query: string;
  timestamp: number;
  type: "location" | "property";
}

const SAVED_SEARCHES_KEY = "saved_searches";
const MAX_SAVED_SEARCHES = 5;

export const getSavedSearches = (): SavedSearch[] => {
  const savedSearchesJson = Cookies.get(SAVED_SEARCHES_KEY);
  if (!savedSearchesJson) return [];

  try {
    return JSON.parse(savedSearchesJson);
  } catch {
    return [];
  }
};

export const saveSearch = (
  query: string,
  type: "location" | "property"
): void => {
  const currentSearches = getSavedSearches();

  // Check if search already exists
  const searchExists = currentSearches.some(
    (search) => search.query.toLowerCase() === query.toLowerCase()
  );

  if (searchExists) return;

  // Add new search to the beginning of the array
  const newSearch: SavedSearch = {
    query,
    timestamp: Date.now(),
    type,
  };

  const updatedSearches = [newSearch, ...currentSearches].slice(
    0,
    MAX_SAVED_SEARCHES
  );

  Cookies.set(SAVED_SEARCHES_KEY, JSON.stringify(updatedSearches), {
    expires: 30,
  });
};

export const removeSearch = (query: string): void => {
  const currentSearches = getSavedSearches();
  const updatedSearches = currentSearches.filter(
    (search) => search.query.toLowerCase() !== query.toLowerCase()
  );

  Cookies.set(SAVED_SEARCHES_KEY, JSON.stringify(updatedSearches), {
    expires: 30,
  });
};
