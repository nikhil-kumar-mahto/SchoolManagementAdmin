import React from "react";
import styles from "./DatePicker.module.css";

interface DatePickerProps {
  label?: string;
  selectedDate: string;
  onDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: string | undefined;
}

const DatePicker: React.FC<DatePickerProps> = ({
  label,
  selectedDate,
  onDateChange,
  error,
}) => {
  return (
    <div className={styles["custom-date-picker"]}>
      {label && <label className={styles["date-picker-label"]}>{label}</label>}
      <input
        type="date"
        value={selectedDate}
        onChange={onDateChange}
        className={styles["date-picker-input"]}
      />
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
};

export default DatePicker;
