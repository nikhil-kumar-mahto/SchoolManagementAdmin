import moment from "moment";
import { useState, useEffect, useRef } from "react";
import styles from "./Select.module.css";

interface SelectProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  error?: string;
  type?: string;
  disabled?: boolean;
  tabIndex?: number | undefined;
  name?: string | undefined;
  searchable?: boolean;
}

function Select({
  options,
  value,
  onChange,
  label,
  placeholder = "Select an option",
  className,
  error,
  type = "",
  disabled = false,
  tabIndex = undefined,
  name = undefined,
  searchable = false,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isValueInOptions =
    options.some((option) => option.value === value) ?? false;
  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    setFilteredOptions(
      options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, options]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        if (value) {
          setSearchTerm("");
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [value]);

  if (!searchable) {
    return (
      <div className={`${styles.selectContainer} ${className || ""}`}>
        {label && (
          <label
            className={`${styles.label} ${error ? styles.errorLabel : ""}`}
          >
            {label}
          </label>
        )}
        <select
          disabled={disabled}
          className={`${styles.select} ${error ? styles.errorState : ""}`}
          value={value || ""}
          onChange={(e) => {
            onChange(e.target.value);
          }}
          tabIndex={tabIndex}
          name={name}
        >
          <option value="">{placeholder}</option>
          {type === "time" && !isValueInOptions && value && (
            <option value={value} disabled>
              {moment(value, "HH:mm").format("hh:mm A")}
            </option>
          )}
          {options.map((option, index) => (
            <option key={index} value={option.value} style={{ color: "#333" }}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className={styles.errorMessage}>{error}</p>}
      </div>
    );
  }

  return (
    <div
      className={`${styles.selectContainer} ${className || ""}`}
      ref={dropdownRef}
    >
      {label && (
        <label className={`${styles.label} ${error ? styles.errorLabel : ""}`}>
          {label}
        </label>
      )}
      <div className={styles.searchableSelectWrapper}>
        <input
          ref={inputRef}
          type="text"
          className={`${styles.searchableInput} ${
            error ? styles.errorState : ""
          }`}
          placeholder={placeholder}
          value={isOpen ? searchTerm : selectedOption?.label || ""}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => {
            setIsOpen(true);
            if (selectedOption) {
              setSearchTerm("");
            }
          }}
          disabled={disabled}
          tabIndex={tabIndex}
          name={name}
        />
        <div
          className={styles.dropdownIcon}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <svg viewBox="0 0 24 24" fill="#333">
            <path d="M7 10l5 5 5-5z" />
          </svg>
        </div>
        {isOpen && (
          <div className={styles.optionsDropdown}>
            {filteredOptions.length === 0 ? (
              <div className={styles.noOptions}>No options found</div>
            ) : (
              filteredOptions.map((option, index) => (
                <div
                  key={index}
                  className={`${styles.option} ${
                    option.value === value ? styles.selectedOption : ""
                  }`}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                >
                  {option.label}
                </div>
              ))
            )}
          </div>
        )}
      </div>
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
}

export default Select;
