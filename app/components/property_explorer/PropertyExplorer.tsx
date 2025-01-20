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
import {
  faChevronDown,
  faList,
  faMap,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Edit } from "lucide-react";
import PropertyManagementModal from "../PropertyManagementModal";

interface PropertyExplorerProps {
  query?: string;
}

type LocationData = {
  id: Key;
  City: string;
  Community: string;
  Subcommunity: string;
  Property: string;
};

type Poi = {
  key: Key;
  location: google.maps.LatLngLiteral;
  property: Property;
};

const PropertyExplorer: React.FC<PropertyExplorerProps> = ({ query }) => {
  // State to manage selected property across map and list view
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isMapView, setIsMapView] = useState(true);
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);

  // Ref for scrolling the list view
  const listViewRef = useRef<HTMLDivElement>(null);

  const filteredProperties = useMemo(() => {
    return propertyData
      .filter((property) => {
        if (!query) return true;

        const searchTerm = query.toLowerCase();

        // Handle different search formats
        // 1. City, State, USA format
        if (searchTerm.includes(",")) {
          const city = searchTerm.split(",")[0].trim();
          return property.City.toLowerCase() === city.toLowerCase();
        }

        // 2. Full address search
        if (property.Subcommunity?.toLowerCase().includes(searchTerm)) {
          return true;
        }

        // 3. General search (existing logic)
        return (
          property.City.toLowerCase().includes(searchTerm) ||
          property.Community?.toLowerCase().includes(searchTerm) ||
          property.Subcommunity?.toLowerCase().includes(searchTerm) ||
          property.Property?.toLowerCase().includes(searchTerm)
        );
      })
      .slice(0, 50);
  }, [query, propertyData]);

  const { mappedLocations, unmappedLocations } = useGeocodeLocations(
    filteredProperties,
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
      <div className="md:flex hidden w-100 h-[calc(100vh_-_138px)] justify-between mt-[138px] overflow-hidden">
        <div className="max-w-[calc(40vw)]">
          <PropertyListView
            mappedProperties={filteredProperties.filter((p) =>
              mappedLocations.some(
                (l: { property: { id: Key } }) => l.property.id === p.id
              )
            )}
            unmappedProperties={unmappedLocations}
            selectedProperty={selectedProperty}
            onPropertySelect={handleListPropertySelect}
            ref={listViewRef}
            isLoading={isLoading}
          />
        </div>
        <PropertyMapView
          mappedLocations={mappedLocations}
          unmappedLocations={unmappedLocations}
          selectedProperty={selectedProperty}
          onPropertySelect={handleMapPropertySelect}
        />
      </div>
      <div className="md:hidden block w-100 h-[calc(100vh_-_138px)] mt-[138px]">
        <div>
          {isMapView ? (
            <div>
              <PropertyMapView
                mappedLocations={mappedLocations}
                unmappedLocations={unmappedLocations}
                selectedProperty={selectedProperty}
                onPropertySelect={handleMapPropertySelect}
              />
            </div>
          ) : (
            <div className="w-100 ">
              <PropertyListView
                mappedProperties={filteredProperties.filter((p) =>
                  mappedLocations.some(
                    (l: { property: { id: Key } }) => l.property.id === p.id
                  )
                )}
                unmappedProperties={unmappedLocations}
                selectedProperty={selectedProperty}
                onPropertySelect={handleListPropertySelect}
                ref={listViewRef}
                isLoading={isLoading}
              />
            </div>
          )}
        </div>
        <button
          onClick={() => setIsMapView(!isMapView)}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[120px] md:w-auto  py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
        >
          <FontAwesomeIcon
            icon={!isMapView ? faMap : faList}
            className="mr-2 h-5 w-5"
          />{" "}
          {isMapView ? "View List" : "View Map"}
        </button>
      </div>
      {/* Floating Edit Button */}
      <button
        onClick={() => setIsPropertyModalOpen(true)}
        className="fixed bottom-6 left-6 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 z-40"
        aria-label="Edit Properties"
      >
        <Edit size={24} />
      </button>

      {/* Property Management Modal */}
      <PropertyManagementModal
        isOpen={isPropertyModalOpen}
        onClose={() => setIsPropertyModalOpen(false)}
      />
    </div>
  );
};

const useGeocodeLocations = (
  locations: LocationData[],
  setIsLoading: {
    (value: React.SetStateAction<boolean>): void;
    (arg0: boolean): void;
  }
) => {
  console.log("useGeocodeLocations");

  const [mappedLocations, setMappedLocations] = useState<Poi[]>([]);
  const [unmappedLocations, setUnmappedLocations] = useState<LocationData[]>(
    []
  );

  useEffect(() => {
    setIsLoading(true);
    const geocodeLocations = async () => {
      const mappedResults: Poi[] = [];
      const unmappedResults: LocationData[] = [];

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
            )}&key=AIzaSyCuKLKXrJxnrM24zucIuMx6VIcXzjWONM8`
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
  }, [locations]);

  return { mappedLocations, unmappedLocations };
};

export default PropertyExplorer;
