import React, { forwardRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTableCells, faList } from "@fortawesome/free-solid-svg-icons";
import ListviewCard from "./ListviewCard";
import CompactListviewCard from "./CompactListViewCard";
import LoadingListviewCard from "./LoadingListViewCard";
import CompactLoadingListviewCard from "./CompactLoadingListviewCard";
import { Property } from "@/types/property";

const PropertyListView = forwardRef<
  HTMLDivElement,
  {
    mappedProperties: Property[];
    unmappedProperties: Property[];
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
    const [isCompactView, setIsCompactView] = useState(false);
    const totalProperties = [...mappedProperties, ...unmappedProperties];
    const hasNoProperties = totalProperties.length === 0;

    return (
      <div className="flex flex-col h-full">
        {/* Fixed Header Section */}
        <div className="flex-none p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Real Estate & Homes for Sale
            </h2>
          </div>

          <div className="flex items-center justify-between">
            {totalProperties.length > 0 ? (
              <span className="text-sm text-gray-500">
                {totalProperties.length} result
                {totalProperties.length > 1 ? "s" : ""}
              </span>
            ) : (
              <div></div>
            )}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsCompactView(!isCompactView)}
                className="flex items-center gap-2 px-3 py-1 text-sm rounded-md bg-[#2d4061] hover:bg-gray-200"
              >
                <FontAwesomeIcon
                  icon={isCompactView ? faTableCells : faList}
                  className="w-4 h-4"
                  color="#white"
                />
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Content Section */}
        <div ref={ref} className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">
            {isLoading && (
              <div className="flex flex-col gap-4">
                {[...Array(3)].map((_, index) =>
                  isCompactView ? (
                    <CompactLoadingListviewCard key={index} />
                  ) : (
                    <LoadingListviewCard key={index} />
                  )
                )}
              </div>
            )}

            {!isLoading && hasNoProperties && (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  Uh oh, no results found. Try searching for something else
                </p>
              </div>
            )}

            {!isLoading && !hasNoProperties && (
              <div className="flex flex-col">
                {mappedProperties.map((property) => (
                  <div
                    key={property.id}
                    onClick={() => onPropertySelect(property)}
                    className={`cursor-pointer rounded-lg ${
                      selectedProperty?.id === property.id ? "bg-[#121822]" : ""
                    }`}
                  >
                    {isCompactView ? (
                      <CompactListviewCard property={property} />
                    ) : (
                      <ListviewCard property={property} />
                    )}
                  </div>
                ))}

                {unmappedProperties.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">
                      Unmapped Properties
                    </h3>
                    {unmappedProperties.map((location, index) => (
                      <div key={index} className="py-2">
                        <p className="font-medium">
                          {location.Property || "Unnamed Property"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {location.Subcommunity}, {location.Community},{" "}
                          {location.City}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

PropertyListView.displayName = "PropertyListView";

export default PropertyListView;
