import React, { Key, useMemo } from "react";
import { MapPin, Clock, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Property {
  id: Key;
  City: string;
  Community: string;
  Subcommunity: string;
  Property: string;
}

interface SavedSearch {
  query: string;
  timestamp: number;
  type: "location" | "property";
}

interface SearchDropdownProps {
  properties: Property[];
  query?: string;
  onSelect: (value: string) => void;
  savedSearches: SavedSearch[];
  onRemoveSavedSearch: (query: string) => void;
}

const RESULTS_LIMIT = 50;

const SearchDropdown: React.FC<SearchDropdownProps> = ({
  properties,
  query,
  onSelect,
  savedSearches,
  onRemoveSavedSearch,
}) => {
  const router = useRouter();

  // Calculate search scores and sort results
  const getSearchScore = (item: string, searchTerm: string): number => {
    const normalizedItem = item.toLowerCase();
    const normalizedSearch = searchTerm.toLowerCase();

    if (normalizedItem === normalizedSearch) return 100;
    if (normalizedItem.startsWith(normalizedSearch)) return 80;
    if (normalizedItem.includes(` ${normalizedSearch}`)) return 60;
    if (normalizedItem.includes(normalizedSearch)) return 40;
    return 0;
  };

  // Memoized filtered locations
  const filteredLocations = useMemo(() => {
    if (!query || query.length < 2) return [];
    const searchTerm = query.toLowerCase();

    // Use a Map to maintain uniqueness and store scores
    const locationScores = new Map<string, number>();

    for (const property of properties) {
      const cityLocation = property.City;
      const score = getSearchScore(cityLocation, searchTerm);

      if (score > 0) {
        // Keep the highest score if the location appears multiple times
        const currentScore = locationScores.get(cityLocation) || 0;
        locationScores.set(cityLocation, Math.max(score, currentScore));
      }

      // Early exit if we have enough high-scoring results
      if (locationScores.size >= RESULTS_LIMIT) break;
    }

    // Convert to array, sort by score, and take top results
    return Array.from(locationScores.entries())
      .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
      .slice(0, RESULTS_LIMIT)
      .map(([location]) => location);
  }, [properties, query]);

  // Memoized filtered properties
  const filteredProperties = useMemo(() => {
    if (!query || query.length < 2) return [];
    const searchTerm = query.toLowerCase();

    const propertyScores: Array<{ property: Property; score: number }> = [];

    for (const property of properties) {
      const propertyScore = Math.max(
        getSearchScore(property.Property, searchTerm),
        getSearchScore(property.City, searchTerm),
        getSearchScore(property.Community, searchTerm),
        getSearchScore(property.Subcommunity, searchTerm)
      );

      if (propertyScore > 0) {
        propertyScores.push({ property, score: propertyScore });
      }

      // Early exit if we have enough results
      if (propertyScores.length >= RESULTS_LIMIT) break;
    }

    return propertyScores
      .sort((a, b) => b.score - a.score)
      .slice(0, RESULTS_LIMIT)
      .map(({ property }) => property);
  }, [properties, query]);

  const handleLocationSelect = (location: string) => {
    router.push(`/?query=${encodeURIComponent(location)}`);
    onSelect(location);
  };

  const handlePropertySelect = (propertyName: string) => {
    router.push(`/?query=${encodeURIComponent(propertyName)}`);
    onSelect(propertyName);
  };

  // Show saved searches when no query
  if (!query) {
    if (savedSearches.length === 0) return null;

    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-4">
            Recent Searches
          </h3>
          <div className="space-y-3">
            {savedSearches.map((search, index) => (
              <div
                key={index}
                className="flex items-center justify-between group hover:bg-gray-50 rounded-lg p-2"
              >
                <div
                  className="flex items-center gap-3 cursor-pointer flex-1"
                  onClick={() => handleLocationSelect(search.query)}
                >
                  <div className="bg-gray-100 p-2 rounded-lg">
                    {search.type === "location" ? (
                      <MapPin className="h-4 w-4 text-gray-600" />
                    ) : (
                      <Clock className="h-4 w-4 text-gray-600" />
                    )}
                  </div>
                  <span className="text-gray-900">{search.query}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveSavedSearch(search.query);
                  }}
                  className="p-1 hover:bg-gray-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Return early if query is too short
  if (query.length < 2) {
    return null;
  }

  // Show search results
  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-y-scroll max-h-[calc(100vh_-_238px)]">
      <div className="p-4">
        <h3 className="text-lg text-gray-600 mb-4">Results</h3>

        {/* Locations */}
        <div className="space-y-4 mb-4">
          {filteredLocations.map((location, index) => (
            <div
              key={`location-${index}`}
              className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
              onClick={() => handleLocationSelect(location)}
            >
              <div className="bg-gray-100 p-2 rounded-lg">
                <MapPin className="h-6 w-6 text-gray-600" />
              </div>
              <span className="text-gray-900">{location}</span>
            </div>
          ))}
        </div>

        {/* Properties */}
        <div className="space-y-4">
          {filteredProperties.map((property, index) => (
            <div
              key={`property-${index}`}
              className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
              onClick={() => handlePropertySelect(property.Property)}
            >
              <Image
                src="https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Property"
                className="h-10 w-10 object-cover rounded-lg"
                height={36}
                width={36}
                unoptimized
              />
              <div>
                <p className="text-gray-900 font-medium">{property.Property}</p>
                <p className="text-gray-600">{property.City}</p>
              </div>
            </div>
          ))}
        </div>

        {filteredLocations.length === 0 && filteredProperties.length === 0 && (
          <div className="text-center text-gray-500 py-4">No results found</div>
        )}
      </div>
    </div>
  );
};

export default SearchDropdown;
