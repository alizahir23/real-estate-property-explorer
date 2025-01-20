"use client";
import React, { useState, useRef, useEffect } from "react";
import { faSearch, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SearchDropdown from "./SearchDropdown";
import propertyData from "@/public/properties.json";
import {
  saveSearch,
  getSavedSearches,
  removeSearch,
} from "@/utils/cookie-utils";

interface SearchFilterBarProps {
  query?: string;
}

const SearchFilterBar = ({ query }: SearchFilterBarProps) => {
  const [inputValue, setInputValue] = useState(query || "");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Use a state updater function to ensure we always have the most recent saved searches
  const [savedSearches, setSavedSearches] = useState(() => getSavedSearches());

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSaveSearch = () => {
    if (!inputValue) return;
    const isLocationSearch = inputValue.includes(",");
    saveSearch(inputValue, isLocationSearch ? "location" : "property");
    // Immediately update the saved searches state
    setSavedSearches(getSavedSearches());
  };

  const handleRemoveSearch = (query: string) => {
    removeSearch(query);
    // Immediately update the saved searches state
    setSavedSearches(getSavedSearches());
  };

  const handleSelect = (value: string) => {
    setInputValue(value);
    setIsDropdownOpen(false);
  };

  const handleClearInput = () => {
    setInputValue("");
    setIsDropdownOpen(false);
  };

  const handleSubmit = () => {
    // Close the dropdown when the form is submitted
    setIsDropdownOpen(false);

    // Blur the input to remove focus
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  return (
    <div className="w-full bg-[#f7f7f7] border-b border-gray-200 fixed top-[64px] z-[49]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center p-4 gap-4 md:gap-8 md:justify-between">
          <form
            action="/"
            onSubmit={handleSubmit}
            className="flex-1 relative md:max-w-[368px]"
          >
            <div ref={containerRef} className="relative">
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500"
              />
              <input
                ref={inputRef}
                type="text"
                name="query"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onFocus={() => setIsDropdownOpen(true)}
                placeholder="City, neighborhood, ZIP code..."
                className="w-full pl-10 pr-10 py-2 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent placeholder:text-gray-500 placeholder:text-[14px]"
              />
              {inputValue && (
                <button
                  type="button"
                  onClick={handleClearInput}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <FontAwesomeIcon icon={faXmark} className="h-4 w-4" />
                </button>
              )}
              {isDropdownOpen && (
                <SearchDropdown
                  properties={propertyData}
                  query={inputValue}
                  onSelect={handleSelect}
                  savedSearches={savedSearches}
                  onRemoveSavedSearch={handleRemoveSearch}
                />
              )}
            </div>
          </form>
          <div className="flex items-center gap-4">
            <button className="w-3/4 md:w-auto px-4 py-2 text-gray-700 bg-white hover:text-gray-900 font-medium rounded-md hover:bg-gray-100 transition-colors">
              All filters
            </button>
            {inputValue && (
              <button
                onClick={handleSaveSearch}
                className="w-1/4 md:w-auto px-4 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
              >
                Save search
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilterBar;
