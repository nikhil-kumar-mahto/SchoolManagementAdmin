import styles from "./Select.module.css";

interface SelectProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  error?: string;
}

function Select({
  options,
  value,
  onChange,
  label,
  placeholder = "Select an option",
  className,
  error,
}: SelectProps) {
  return (
    <div className={`${styles.selectContainer} ${className || ""}`}>
      {label && <label className={styles.label}>{label}</label>}
      <select
        className={styles.select}
        value={value as string}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="" disabled hidden>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value.toString()} value={option.value as string}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
}

export default Select;
