import moment from "moment";
import { useState, useEffect, useRef, KeyboardEvent } from "react";
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
  allowEmpty?: boolean;
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
  allowEmpty = true,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const optionsRef = useRef<(HTMLDivElement | null)[]>([]);

  const isValueInOptions =
    options.some((option) => option.value === value) ?? false;
  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    optionsRef.current = Array(filteredOptions.length).fill(null);
  }, [filteredOptions.length]);

  useEffect(() => {
    setFilteredOptions(
      options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFocusedIndex(-1);
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
        setFocusedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [value]);

  useEffect(() => {
    if (focusedIndex >= 0 && optionsRef.current[focusedIndex]) {
      optionsRef.current[focusedIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [focusedIndex]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter") {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusedIndex((prevIndex) => {
          const nextIndex =
            prevIndex < filteredOptions.length - 1 ? prevIndex + 1 : 0;
          return nextIndex;
        });
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex((prevIndex) => {
          const nextIndex =
            prevIndex > 0 ? prevIndex - 1 : filteredOptions.length - 1;
          return nextIndex;
        });
        break;
      case "Enter":
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
          selectOption(filteredOptions[focusedIndex].value);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setFocusedIndex(-1);
        break;
      case "Tab":
        setIsOpen(false);
        setFocusedIndex(-1);
        break;
      default:
        break;
    }
  };

  const selectOption = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm("");
    setFocusedIndex(-1);
    inputRef.current?.focus();
  };

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
          {/* {allowEmpty && <option value="">{placeholder}</option>} */}
          <option value="" disabled={!allowEmpty}>
            {placeholder}
          </option>
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
          onKeyDown={handleKeyDown}
          disabled={disabled}
          tabIndex={tabIndex}
          name={name}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls="options-listbox"
          role="combobox"
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
          <div
            className={styles.optionsDropdown}
            id="options-listbox"
            role="listbox"
          >
            {filteredOptions.length === 0 ? (
              <div className={styles.noOptions}>No options found</div>
            ) : (
              filteredOptions.map((option, index) => (
                <div
                  ref={(el) => (optionsRef.current[index] = el)}
                  key={index}
                  className={`${styles.option} 
                    ${option.value === value ? styles.selectedOption : ""} 
                    ${index === focusedIndex ? styles.focusedOption : ""}`}
                  onClick={() => selectOption(option.value)}
                  role="option"
                  aria-selected={option.value === value}
                  tabIndex={-1}
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
