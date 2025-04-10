import React from "react";
import styles from "./Button.module.css";
import Loader from "../Loader/Loader"; // Import your Loader component

interface ButtonProps {
  text: string;
  onClick: () => void;
  type?: "outline" | "filled";
  className?: string;
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  type = "filled",
  className,
  isLoading = false,
}) => {
  return (
    <button
      onClick={onClick}
      className={`${styles.button} ${
        type === "outline" ? styles.outline : styles.filled
      } ${className || ""} ${isLoading ? styles.loading : ""}`}
      disabled={isLoading}
    >
      {isLoading ? <Loader size="small" color="white" /> : text}
    </button>
  );
};

export default Button;
