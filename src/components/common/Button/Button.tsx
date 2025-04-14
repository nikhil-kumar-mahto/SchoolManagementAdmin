import React from "react";
import styles from "./Button.module.css";
import Loader from "../Loader/Loader";

interface ButtonProps {
  text: string;
  onClick: () => void;
  type?: "outline" | "filled";
  className?: string;
  isLoading?: boolean;
  style?: any;
}

const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  type = "filled",
  className,
  isLoading = false,
  style,
}) => {
  return (
    <button
      onClick={onClick}
      className={`${styles.button} ${
        type === "outline" ? styles.outline : styles.filled
      } ${className || ""} ${isLoading ? styles.loading : ""}`}
      disabled={isLoading}
      style={style}
      type="button"
    >
      {isLoading ? <Loader size="small" color="white" /> : <span>{text}</span>}
    </button>
  );
};

export default Button;
