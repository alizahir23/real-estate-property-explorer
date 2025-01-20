import React, { Key } from "react";
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

const SearchDropdown: React.FC<SearchDropdownProps> = ({
  properties,
  query,
  onSelect,
  savedSearches,
  onRemoveSavedSearch,
}) => {
  const router = useRouter();

  // Filter locations based on query
  const getFilteredLocations = () => {
    if (!query) return [];
    const searchTerm = query.toLowerCase();
    const uniqueLocations = new Set<string>();

    properties.forEach((property) => {
      // Using just the city since we don't have state in the data
      const cityLocation = `${property.City}`;
      if (cityLocation.toLowerCase().includes(searchTerm)) {
        uniqueLocations.add(cityLocation);
      }
    });

    return Array.from(uniqueLocations);
  };

  // Filter properties based on query
  const getFilteredProperties = () => {
    if (!query) return [];
    const searchTerm = query.toLowerCase();
    return properties.filter(
      (property) =>
        property.Property.toLowerCase().includes(searchTerm) ||
        property.City.toLowerCase().includes(searchTerm) ||
        property.Community.toLowerCase().includes(searchTerm) ||
        property.Subcommunity.toLowerCase().includes(searchTerm)
    );
  };

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
      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden ">
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

  // Get filtered results
  const locations = getFilteredLocations();
  const filteredProperties = getFilteredProperties();

  // Show search results
  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-scroll max-h-[calc(100vh_-_238px)]">
      <div className="p-4">
        <h3 className="text-lg text-gray-600 mb-4">Results</h3>

        {/* Locations */}
        <div className="space-y-4 mb-4">
          {locations.map((location, index) => (
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

        {locations.length === 0 && filteredProperties.length === 0 && (
          <div className="text-center text-gray-500 py-4">No results found</div>
        )}
      </div>
    </div>
  );
};

export default SearchDropdown;
