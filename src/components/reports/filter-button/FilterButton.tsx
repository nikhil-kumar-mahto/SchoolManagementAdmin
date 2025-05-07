import React from "react";
import styles from "./FilterButton.module.css";

interface FiltersProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

const Filters: React.FC<FiltersProps> = ({
  selectedFilter,
  onFilterChange,
}) => {
  const filters = ["Today", "Week", "Month", "Custom Date Range"];

  return (
    <div className={styles.filters}>
      {filters.map((filter) => (
        <button
          key={filter}
          className={`${styles.filterButton} ${
            selectedFilter === filter ? styles.active : ""
          }`}
          onClick={() => onFilterChange(filter)}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};

export default Filters;
