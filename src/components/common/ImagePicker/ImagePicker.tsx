/* eslint-disable */
// @ts-nocheck


import React, { useState, ChangeEvent, useEffect, useRef } from "react";
import styles from "./ImagePicker.module.css";
import { DeleteIcon } from "../../../assets/svgs";

interface ImagePickerProps {
  label?: string;
  value: string | null;
  onChange: (file: File | null) => void;
  className?: string;
  error?: string;
  componentKey?: string;
  tabIndex?: number | undefined;
  showPreview?: boolean;
}

const ImagePicker: React.FC<ImagePickerProps> = ({
  label,
  value,
  onChange,
  className,
  error,
  componentKey,
  tabIndex = undefined,
  showPreview = true,
}) => {
  const [fileName, setFileName] = useState<string | null>(value ? value : null);
  const [file, setFile] = useState<File | null | string>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!fileName) {
      setFileName(value);
      setFile(value);
    }
  }, [value]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      setFileName(file.name);
      onChange(file);
    } else {
      setFileName(null);
      onChange("");
    }
  };

  const handleDeleteImage = () => {
    setFile(null);
    setFileName(null);
    onChange("");

    if (inputRef.current) {
      inputRef.current.value = "";
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
          accept="image/jpeg,image/png,image/webp,image/jpg"
          onChange={handleFileChange}
          className={`${styles.input} ${error ? styles.errorState : ""}`}
          ref={inputRef}
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

      {showPreview && file && typeof file !== "string" && (
        <div className={styles.previewContainer}>
          <img
            src={URL.createObjectURL(file)}
            alt="Preview"
            className={styles.previewImage}
          />
          <button
            type="button"
            className={styles.deleteIconContainer}
            onClick={handleDeleteImage}
          >
            <DeleteIcon />
          </button>
        </div>
      )}

      {showPreview && file && typeof file === "string" && (
        <div className={styles.previewContainer}>
          <img src={file} alt="Preview" className={styles.previewImage} />
          <button
            type="button"
            className={styles.deleteIconContainer}
            onClick={handleDeleteImage}
          >
            <DeleteIcon />
          </button>
        </div>
      )}
    </div>
  );
};

export default ImagePicker;
