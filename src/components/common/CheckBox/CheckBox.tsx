import React from "react";
import styles from "./CheckBox.module.css";

interface CheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
  disabled?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({
  id,
  label,
  checked,
  onChange,
  className,
  disabled,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };

  return (
    <div
      className={`${styles.checkboxContainer} ${className || ""} ${
        disabled ? styles.disabled : ""
      }`}
    >
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={handleChange}
        className={styles.checkboxInput}
        disabled={disabled}
      />
      <label htmlFor={id} className={styles.checkboxLabel}>
        {label}
      </label>
    </div>
  );
};

export default Checkbox;
