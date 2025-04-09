import React, { ChangeEvent } from "react";
import styles from "./Input.module.css";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface InputProps {
  label?: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  //   icon?: IconProp;
  type?: "text" | "password" | "email" | "number" | "tel" | "url";
  [key: string]: any;
}

const Input: React.FC<InputProps> = ({
  label,
  value,
  onChange,
  error,
  icon,
  type = "text",
  ...props
}) => {
  return (
    <div className={styles.inputContainer}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={`${styles.inputWrapper} ${error ? styles.error : ""}`}>
        {/* {icon && (
          <FontAwesomeIcon icon={icon} className={styles.icon} />
        )} */}
        <input
          type={type}
          value={value}
          onChange={onChange}
          className={styles.input}
          {...props}
        />
      </div>
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
};

export default Input;
