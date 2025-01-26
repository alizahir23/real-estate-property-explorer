"use client";
import React, {
  Key,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import PropertyListView from "./PropertyListView";
import PropertyMapView from "./PropertyMapView";
import propertyData from "../../../public/properties.json";
import { Property } from "@/types/property";
import { faList, faMap } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Edit } from "lucide-react";
import PropertyManagementModal from "../PropertyManagementModal";

const ITEMS_PER_PAGE = 25;

interface PropertyExplorerProps {
  query?: string | undefined;
}

type Poi = {
  key: Key;
  location: google.maps.LatLngLiteral;
  property: Property;
};

const PropertyExplorer: React.FC<PropertyExplorerProps> = ({ query }) => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isMapView, setIsMapView] = useState(true);
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
  const [page, setPage] = useState(1);

  const listViewRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  // Get all filtered properties before pagination
  const allFilteredProperties = useMemo(() => {
    return propertyData.filter((property) => {
      if (!query) return true;
      const searchTerm = query.toLowerCase();

      if (searchTerm.includes(",")) {
        const city = searchTerm.split(",")[0].trim();
        return property.City.toLowerCase() === city.toLowerCase();
      }

      if (property.Subcommunity?.toLowerCase().includes(searchTerm)) {
        return true;
      }

      return (
        property.City.toLowerCase().includes(searchTerm) ||
        property.Community?.toLowerCase().includes(searchTerm) ||
        property.Subcommunity?.toLowerCase().includes(searchTerm) ||
        property.Property?.toLowerCase().includes(searchTerm)
      );
    });
  }, [query]);

  // Get paginated properties
  const paginatedProperties = useMemo(() => {
    return allFilteredProperties.slice(0, page * ITEMS_PER_PAGE);
  }, [allFilteredProperties, page]);

  const hasMore = allFilteredProperties.length > paginatedProperties.length;

  // Reset pagination when search query changes
  useEffect(() => {
    setPage(1);
  }, [query]);

  // Setup intersection observer
  useEffect(() => {
    if (!loadingRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loadingRef.current);

    return () => observer.disconnect();
  }, [hasMore, isLoading]);

  const { mappedLocations, unmappedLocations } = useGeocodeLocations(
    paginatedProperties,
    setIsLoading
  );

  const handleMapPropertySelect = useCallback((property: Property | null) => {
    setSelectedProperty(property);

    if (listViewRef.current) {
      const propertyElement = listViewRef.current.querySelector(
        `[data-property-id="${property?.id}"]`
      );
      if (propertyElement) {
        propertyElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, []);

  const handleListPropertySelect = useCallback((property: Property) => {
    setSelectedProperty(property);
  }, []);

  return (
    <div>
      <div className="md:flex hidden w-full h-[calc(100vh_-_88px)] justify-between mt-[88px] overflow-hidden">
        <div className="w-[calc(35vw)] flex flex-col">
          <PropertyListView
            mappedProperties={paginatedProperties.filter((p) =>
              mappedLocations.some(
                (l: { property: { id: Key } }) => l.property.id === p.id
              )
            )}
            unmappedProperties={unmappedLocations}
            selectedProperty={selectedProperty}
            onPropertySelect={handleListPropertySelect}
            ref={listViewRef}
            loadingRef={loadingRef}
            isLoading={isLoading}
            hasMore={hasMore}
          />
        </div>
        <PropertyMapView
          mappedLocations={mappedLocations}
          selectedProperty={selectedProperty}
          onPropertySelect={handleMapPropertySelect}
          query={query}
        />
      </div>

      <div className="md:hidden block w-full h-[calc(100vh_-_88px)] mt-[88px] relative">
        {isMapView ? (
          <div className="h-full">
            <PropertyMapView
              mappedLocations={mappedLocations}
              selectedProperty={selectedProperty}
              onPropertySelect={handleMapPropertySelect}
              query={query}
            />
          </div>
        ) : (
          <div className="h-full">
            <PropertyListView
              mappedProperties={paginatedProperties.filter((p) =>
                mappedLocations.some(
                  (l: { property: { id: Key } }) => l.property.id === p.id
                )
              )}
              unmappedProperties={unmappedLocations}
              selectedProperty={selectedProperty}
              onPropertySelect={handleListPropertySelect}
              ref={listViewRef}
              loadingRef={loadingRef}
              isLoading={isLoading}
              hasMore={hasMore}
            />
          </div>
        )}
        <div className="fixed bottom-4 left-0 w-full flex justify-center z-40">
          <button
            onClick={() => setIsMapView(!isMapView)}
            className="w-[120px] py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
          >
            <FontAwesomeIcon
              icon={!isMapView ? faMap : faList}
              className="mr-2 h-5 w-5"
            />
            {isMapView ? "View List" : "View Map"}
          </button>
        </div>
      </div>

      <button
        onClick={() => setIsPropertyModalOpen(true)}
        className="fixed bottom-6 left-6 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 z-40"
        aria-label="Edit Properties"
      >
        <Edit size={24} />
      </button>

      <PropertyManagementModal
        isOpen={isPropertyModalOpen}
        onClose={() => setIsPropertyModalOpen(false)}
      />
    </div>
  );
};
const useGeocodeLocations = (
  locations: Property[],
  setIsLoading: {
    (value: React.SetStateAction<boolean>): void;
    (arg0: boolean): void;
  }
) => {
  console.log("useGeocodeLocations");
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const [mappedLocations, setMappedLocations] = useState<Poi[]>([]);
  const [unmappedLocations, setUnmappedLocations] = useState<Property[]>([]);

  useEffect(() => {
    setIsLoading(true);
    const geocodeLocations = async () => {
      const mappedResults: Poi[] = [];
      const unmappedResults: Property[] = [];

      for (const location of locations) {
        const addressParts = [
          location.Property,
          location.Subcommunity,
          location.Community,
          location.City,
        ].filter((part) => part && part.trim() !== "");

        const address = addressParts.join(", ");
        const key = location.id;

        try {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
              address
            )}&key=${apiKey}`
          );

          const data = await response.json();

          if (data.results.length > 0) {
            mappedResults.push({
              key,
              location: data.results[0].geometry.location,
              property: location,
            });
          } else {
            unmappedResults.push(location);
          }
        } catch (error) {
          console.error(`Geocoding error for ${address}:`, error);
          unmappedResults.push(location);
        }
      }

      setMappedLocations(mappedResults);
      setUnmappedLocations(unmappedResults);
      setIsLoading(false);
    };

    geocodeLocations();
  }, [locations, apiKey, setIsLoading]);

  return { mappedLocations, unmappedLocations };
};
export default PropertyExplorer;
