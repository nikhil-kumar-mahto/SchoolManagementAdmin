import React from "react";
import styles from "./Button.module.css";

interface ButtonProps {
  text: string;
  onClick: () => void;
  type?: "outline" | "filled";
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  type = "filled",
  className,
}) => {
  return (
    <button
      onClick={onClick}
      className={`${styles.button} ${
        type === "outline" ? styles.outline : styles.filled
      } ${className || ""} p-3`}
    >
      {text}
    </button>
  );
};

export default Button;
