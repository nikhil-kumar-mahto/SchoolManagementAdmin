/* eslint-disable */
// @ts-nocheck


import React from "react";
import styles from "./Loader.module.css";

interface LoaderProps {
  size?: "small" | "medium" | "large";
  color?: string;
  className?: string;
  text?: string;
}

const Loader: React.FC<LoaderProps> = ({
  size = "medium",
  color = "#007bff",
  className,
  text,
}) => {
  const loaderStyle = {
    borderColor: `${color} ${color} transparent`,
  };

  return (
    <div className={`${styles.loaderContainer} ${className || ""}`}>
      <div className={`${styles.loader} ${styles[size]}`} style={loaderStyle} />
      {text && <p className={styles.loaderText}>{text}</p>}
    </div>
  );
};

export default Loader;
