import React, { useState, ChangeEvent, useEffect } from "react";
import styles from "./ImagePicker.module.css";

interface ImagePickerProps {
  label?: string;
  value: string | null;
  onChange: (file: File | null) => void;
  className?: string;
  error?: string;
  componentKey?: string;
  tabIndex?: number | undefined;
}

const ImagePicker: React.FC<ImagePickerProps> = ({
  label,
  value,
  onChange,
  className,
  error,
  componentKey,
  tabIndex = undefined,
}) => {
  const [fileName, setFileName] = useState<string | null>(value ? value : null);

  useEffect(() => {
    if (!fileName) {
      setFileName(value);
    }
  }, [value]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onChange(file);
    } else {
      setFileName(null);
      onChange(null);
    }
  };

  return (
    <div className={`${styles.imagePickerContainer} ${className || ""}`}>
      {label && (
        <label className={`${styles.label} ${error ? styles.errorState : ""}`}>
          {label}
        </label>
      )}
      <div
        className={`${styles.inputWrapper} ${error ? styles.errorState : ""}`}
        tabIndex={tabIndex}
      >
        <input
          type="file"
          id={`imageInput-${componentKey}`}
          accept="image/*"
          onChange={handleFileChange}
          className={`${styles.input} ${error ? styles.errorState : ""}`}
        />
        <label
          htmlFor={`imageInput-${componentKey}`}
          className={`${styles.fileLabel} mb-0 ${
            error ? styles.errorLabel : ""
          }`}
        >
          {fileName ? fileName : "Choose File"}
        </label>
      </div>
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
};

export default ImagePicker;
