import moment from "moment";
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
}: SelectProps) {
  const isValueInOptions = options.some((option) => option.value === value);

  return (
    <div className={`${styles.selectContainer} ${className || ""}`}>
      {label && (
        <label className={`${styles.label} ${error ? styles.errorLabel : ""}`}>
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
      >
        <option value="" disabled hidden>
          {placeholder}
        </option>
        {type === "time" && !isValueInOptions && value && (
          <option value={value} disabled>
            {moment(value, "HH:mm").format("hh:mm A")}
          </option>
        )}
        {options.map((option) => (
          <option
            key={option.value.toString()}
            value={option.value}
            style={{ color: "#333" }}
          >
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
}

export default Select;
