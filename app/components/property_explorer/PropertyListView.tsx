import React, { forwardRef, Key } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsUpDown, faSpinner } from "@fortawesome/free-solid-svg-icons";
import ListviewCard from "./ListviewCard";
import { Property } from "@/types/property";

type LocationData = {
  id: Key;
  City: string;
  Community: string;
  Subcommunity: string;
  Property: string;
};

const PropertyListView = forwardRef<
  HTMLDivElement,
  {
    mappedProperties: Property[];
    unmappedProperties: LocationData[];
    selectedProperty: Property | null;
    onPropertySelect: (property: Property) => void;
    isLoading?: boolean;
  }
>(
  (
    {
      mappedProperties,
      unmappedProperties,
      selectedProperty,
      onPropertySelect,
      isLoading = false,
    },
    ref
  ) => {
    // Combine total properties
    const totalProperties = [...mappedProperties, ...unmappedProperties];

    // Check if there are no properties
    const hasNoProperties = totalProperties.length === 0;
    return (
      <div
        ref={ref}
        className="w-full  h-[calc(100vh-128px)] px-4 pt-2 pb-4 overflow-y-auto"
      >
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-900">
            Real Estate & Homes for Sale
          </h3>
          <div className="flex justify-between items-center mt-1">
            <p className="text-sm text-gray-600">
              {totalProperties.length} results
            </p>
            <div className="flex items-center gap-2 cursor-pointer hover:text-gray-900">
              <p className="text-sm text-gray-600">Newest</p>
              <FontAwesomeIcon
                icon={faArrowsUpDown}
                className="h-3 w-3 text-gray-600"
              />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center h-full">
            <div className="flex flex-col items-center">
              <FontAwesomeIcon
                icon={faSpinner}
                className="h-8 w-8 text-gray-500 animate-spin"
              />
              <p className="mt-4 text-gray-600">Loading...</p>
            </div>
          </div>
        )}

        {/* No Results State */}
        {!isLoading && hasNoProperties && (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-600 text-center">
              Uh oh, no results found. Try searching for something else
            </p>
          </div>
        )}

        {/* Properties List */}
        {!isLoading && !hasNoProperties && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {/* Mapped Properties */}
            {mappedProperties.map((property) => (
              <div
                key={property.id}
                data-property-id={property.id}
                onClick={() => onPropertySelect(property)}
                className={`cursor-pointer rounded-lg ${
                  selectedProperty?.id === property.id ? "bg-gray-200" : ""
                }`}
              >
                <ListviewCard property={property} />
              </div>
            ))}
          </div>
        )}

        {/* Unmapped Properties */}
        {unmappedProperties.length > 0 && (
          <div className="mt-8">
            <h4 className="text-lg font-semibold text-gray-900">
              Unmapped Properties
            </h4>
            {unmappedProperties.map((location, index) => (
              <div
                key={index}
                className="cursor-pointer hover:bg-gray-100 rounded-lg p-4"
              >
                <p className="text-gray-900 font-medium">
                  {location.Property || "Unnamed Property"}
                </p>
                <p className="text-gray-600 text-sm">
                  {location.Subcommunity}, {location.Community}, {location.City}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

export default PropertyListView;
