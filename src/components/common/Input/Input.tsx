import React, { ChangeEvent } from "react";
import styles from "./Input.module.css";

interface InputProps {
  label?: string;
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  type?: "text" | "password" | "email" | "number" | "tel" | "url";
  iconRight?: React.ReactNode;
  [key: string]: any;
  onKeyPress?: () => void;
  maxLength?: undefined | number;
  tabIndex?: undefined | number;
  handleIconButtonClick?: () => void;
}

const Input: React.FC<InputProps> = ({
  label,
  value,
  onChange,
  error,
  iconRight,
  type = "text",
  onKeyPress = () => {},
  maxLength = undefined,
  tabIndex = undefined,
  handleIconButtonClick = () => {},
  ...props
}) => {
  return (
    <div className={styles.inputContainer}>
      {label && (
        <label className={`${styles.label} ${error ? styles.errorLabel : ""}`}>
          {label}
        </label>
      )}
      <div
        className={`${styles.inputWrapper} ${error ? styles.errorState : ""}`}
      >
        <input
          type={type}
          value={value}
          onChange={onChange}
          className={`${styles.input} ${iconRight ? styles.withIconRight : ""}`}
          onKeyDown={onKeyPress}
          maxLength={maxLength}
          tabIndex={tabIndex}
          {...props}
        />
        {iconRight && (
          <button
            type="button"
            className={styles.iconRight}
            onClick={handleIconButtonClick}
          >
            {iconRight}
          </button>
        )}
      </div>
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
};

export default Input;
