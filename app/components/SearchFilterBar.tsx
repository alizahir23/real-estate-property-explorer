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
  query?: string | undefined;
}

const SearchFilterBar = ({ query }: SearchFilterBarProps) => {
  const [inputValue, setInputValue] = useState(query || "");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [savedSearches, setSavedSearches] = useState(() => getSavedSearches());

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (inputValue) {
      setShowSaveButton(true);
      setIsSearching(true);
    } else {
      setShowSaveButton(false);
      setIsSearching(false);
    }
  }, [inputValue]);

  const handleSaveSearch = () => {
    if (!inputValue) return;
    const isLocationSearch = inputValue.includes(",");
    saveSearch(inputValue, isLocationSearch ? "location" : "property");
    setSavedSearches(getSavedSearches());
  };

  const handleRemoveSearch = (query: string) => {
    removeSearch(query);
    setSavedSearches(getSavedSearches());
  };

  const handleSelect = (value: string) => {
    setInputValue(value);
    setIsDropdownOpen(false);
    setIsFocused(false);
  };

  const handleClearInput = () => {
    setInputValue("");
    setIsDropdownOpen(false);
    setIsFocused(false);
  };

  const handleSubmit = () => {
    setIsDropdownOpen(false);
    setIsFocused(false);
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  return (
    <div
      className={`absolute left-1/2 transform -translate-x-1/2 top-[24px] transition-all duration-300 ease-in-out z-[49] ${
        isFocused ? "md:w-2/3 w-full " : "md:w-3/5 w-2/3"
      }`}
    >
      <div className="w-full">
        <div className="px-4 py-2">
          <form
            action="/"
            onSubmit={handleSubmit}
            className="flex-1 relative w-full"
          >
            <div ref={containerRef} className="relative">
              {/* Animated border container */}
              <div
                className={`absolute inset-0 rounded-full ${
                  isSearching
                    ? "before:absolute before:inset-[-2px] before:rounded-full before:bg-gradient-to-r before:from-blue-500 before:via-purple-500 before:to-pink-500 before:animate-rotate-gradient before:blur-sm"
                    : ""
                }`}
              >
                <div className="absolute inset-0 bg-white rounded-full" />
              </div>

              <div className="relative">
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
                  onFocus={() => {
                    setIsDropdownOpen(true);
                    setIsFocused(true);
                  }}
                  placeholder="City, neighborhood, ZIP code..."
                  className="w-full pl-10 pr-24 py-3 bg-transparent rounded-full border border-white focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent text-gray-800 placeholder:text-gray-500 placeholder:text-[14px] shadow-lg transition-all duration-300 ease-in-out"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  {inputValue && (
                    <button
                      type="button"
                      onClick={handleClearInput}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <FontAwesomeIcon icon={faXmark} className="h-4 w-4" />
                    </button>
                  )}
                  {showSaveButton && (
                    <button
                      type="button"
                      onClick={handleSaveSearch}
                      className="px-3 py-1.5 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-all duration-300 ease-in-out opacity-100 transform scale-100"
                    >
                      Save
                    </button>
                  )}
                </div>
              </div>
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
        </div>
      </div>
    </div>
  );
};

export default SearchFilterBar;
