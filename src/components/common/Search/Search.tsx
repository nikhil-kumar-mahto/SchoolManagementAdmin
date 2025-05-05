/* eslint-disable */
// @ts-nocheck

import React, { useState, useRef, useEffect } from "react";
import styles from "./Search.module.css";

interface SearchDebounceProps {
  onSearch: (query: string) => void;
  debounceDelay?: number;
  placeholder?: string;
  className?: string;
}

const SearchDebounce: React.FC<SearchDebounceProps> = ({
  onSearch,
  debounceDelay = 500,
  placeholder = "Search...",
  className,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (debouncedSearch.current) {
        clearTimeout(debouncedSearch.current);
      }
    };
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchTerm(query);

    if (debouncedSearch.current) {
      clearTimeout(debouncedSearch.current);
    }

    debouncedSearch.current = setTimeout(() => {
      onSearch(query);
    }, debounceDelay);
  };

  return (
    <div className={`${styles.searchContainer} ${className || ""}`}>
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleChange}
        className={styles.searchInput}
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={styles.searchIcon}
      >
        <path
          fillRule="evenodd"
          d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
};

export default SearchDebounce;
