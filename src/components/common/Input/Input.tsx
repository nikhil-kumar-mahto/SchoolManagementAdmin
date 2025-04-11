import React, { ChangeEvent } from "react";
import styles from "./Input.module.css";

interface InputProps {
  label?: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  type?: "text" | "password" | "email" | "number" | "tel" | "url";
  [key: string]: any;
  onKeyPress?: () => void;
  maxLength?: undefined | number
}

const Input: React.FC<InputProps> = ({
  label,
  value,
  onChange,
  error,
  icon,
  type = "text",
  onKeyPress = () => {},
  maxLength = undefined,
  ...props
}) => {
  return (
    <div className={styles.inputContainer}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={`${styles.inputWrapper} ${error ? styles.error : ""}`}>
        <input
          type={type}
          value={value}
          onChange={onChange}
          className={styles.input}
          onKeyDown={onKeyPress}
          maxLength={maxLength}
          {...props}
        />
      </div>
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
};

export default Input;
