import React, { forwardRef, MutableRefObject, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTableCells,
  faList,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import ListviewCard from "./ListviewCard";
import CompactListviewCard from "./CompactListViewCard";
import LoadingListviewCard from "./LoadingListViewCard";
import CompactLoadingListviewCard from "./CompactLoadingListviewCard";
import { Property } from "@/types/property";

interface PropertyListViewProps {
  mappedProperties: Property[];
  unmappedProperties: Property[];
  selectedProperty: Property | null;
  onPropertySelect: (property: Property) => void;
  isLoading?: boolean;
  hasMore?: boolean;
  loadingRef?: MutableRefObject<HTMLDivElement | null>;
}

type SortOption = {
  label: string;
  field: "price" | "name";
  order: "asc" | "desc";
};

const sortOptions: SortOption[] = [
  { label: "Price: Low to High", field: "price", order: "asc" },
  { label: "Price: High to Low", field: "price", order: "desc" },
  { label: "Name: A to Z", field: "name", order: "asc" },
  { label: "Name: Z to A", field: "name", order: "desc" },
];

const PropertyListView = forwardRef<HTMLDivElement, PropertyListViewProps>(
  (
    {
      mappedProperties,
      unmappedProperties,
      selectedProperty,
      onPropertySelect,
      isLoading = false,
      hasMore = false,
      loadingRef,
    },
    ref
  ) => {
    const [isCompactView, setIsCompactView] = React.useState(false);
    const [selectedSort, setSelectedSort] = useState<SortOption>(
      sortOptions[0]
    );
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const totalProperties = [...mappedProperties, ...unmappedProperties];
    const hasNoProperties = totalProperties.length === 0;

    // Sorting function
    const sortProperties = (properties: Property[]) => {
      return [...properties].sort((a, b) => {
        if (selectedSort.field === "price") {
          return selectedSort.order === "asc"
            ? (a.price || 0) - (b.price || 0)
            : (b.price || 0) - (a.price || 0);
        } else {
          const nameA = a.Property?.toLowerCase() || "";
          const nameB = b.Property?.toLowerCase() || "";
          return selectedSort.order === "asc"
            ? nameA.localeCompare(nameB)
            : nameB.localeCompare(nameA);
        }
      });
    };

    const renderLoadingCards = () => (
      <div className="flex flex-col gap-4">
        {[...Array(3)].map((_, index) =>
          isCompactView ? (
            <CompactLoadingListviewCard key={index} />
          ) : (
            <LoadingListviewCard key={index} />
          )
        )}
      </div>
    );

    const sortedMappedProperties = sortProperties(mappedProperties);

    return (
      <div className="flex flex-col h-full">
        <div className="flex-none p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Real Estate & Homes for Sale
            </h2>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {totalProperties.length > 0 && (
                <span className="text-sm text-gray-500">
                  {totalProperties.length}
                  {hasMore && "+"} result
                  {totalProperties.length > 1 ? "s" : ""}
                  {hasMore && ", scroll down for more!"}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md bg-[#2d4061] hover:bg-[#3d5070] text-white transition-colors duration-200"
                >
                  <span>{selectedSort.label}</span>
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`w-3 h-3 transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-1 w-48 rounded-md shadow-lg bg-[#1e293b] border border-gray-700 overflow-hidden z-20">
                      {sortOptions.map((option) => (
                        <button
                          key={`${option.field}-${option.order}`}
                          className={`w-full px-4 py-2 text-sm text-left hover:bg-[#2d4061] transition-colors duration-200 ${
                            selectedSort.field === option.field &&
                            selectedSort.order === option.order
                              ? "bg-[#2d4061] text-white"
                              : "text-gray-300"
                          }`}
                          onClick={() => {
                            setSelectedSort(option);
                            setIsDropdownOpen(false);
                          }}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={() => setIsCompactView(!isCompactView)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md bg-[#2d4061] hover:bg-[#3d5070] text-white transition-colors duration-200"
              >
                <FontAwesomeIcon
                  icon={isCompactView ? faTableCells : faList}
                  className="w-4 h-4"
                />
              </button>
            </div>
          </div>
        </div>

        <div ref={ref} className="flex-1 overflow-y-auto">
          {/* Rest of the component remains the same */}
          <div className="p-4 space-y-4">
            {isLoading && hasNoProperties && renderLoadingCards()}

            {!isLoading && hasNoProperties && (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  Uh oh, no results found. Try searching for something else
                </p>
              </div>
            )}

            {!hasNoProperties && (
              <div className="flex flex-col gap-4">
                {sortedMappedProperties.map((property) => (
                  <div
                    key={property.id}
                    data-property-id={property.id}
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

                {(isLoading || hasMore) && (
                  <div
                    ref={loadingRef}
                    className="py-4 text-center text-gray-500"
                  >
                    {isLoading && totalProperties.length > 0
                      ? renderLoadingCards()
                      : hasMore && "Scroll for more"}
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
