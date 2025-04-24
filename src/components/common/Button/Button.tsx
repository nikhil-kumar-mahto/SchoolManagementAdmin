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
  color?: string;
  buttonType?: "button" | "submit" | "reset";
  variant?: "primary" | "danger";
}

const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  type = "filled",
  className,
  isLoading = false,
  style,
  buttonType = "button",
  variant = "primary",
}) => {
  return (
    <button
      onClick={onClick}
      className={`${styles.button} ${
        type === "outline" ? styles.outline : styles.filled
      } ${className || ""} ${isLoading ? styles.loading : ""} ${
        variant === "danger" ? styles.danger : ""
      }`}
      disabled={isLoading}
      style={style}
      type={buttonType}
    >
      {isLoading ? <Loader size="small" color="white" /> : <span>{text}</span>}
    </button>
  );
};

export default Button;
