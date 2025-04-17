import React from "react";
import styles from "./DatePicker.module.css";

interface DatePickerProps {
  label?: string;
  selectedDate: string;
  onDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: string | undefined;
  className?: string;
  type?: string;
  min?: string | number | undefined;
}

const DatePicker: React.FC<DatePickerProps> = ({
  label,
  selectedDate,
  onDateChange,
  error,
  className,
  type = "date",
  min = undefined,
  ...props
}) => {
  return (
    <div className={`${styles["custom-date-picker"]} ${className}`}>
      {label && (
        <label
          className={`${styles["date-picker-label"]} ${
            error ? styles.errorLabel : ""
          }`}
        >
          {label}
        </label>
      )}
      <input
        type={type}
        value={selectedDate}
        onChange={onDateChange}
        className={`${styles["date-picker-input"]} ${
          error ? styles.errorState : ""
        }`}
        min={min}
        {...props}
      />
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
};

export default DatePicker;
