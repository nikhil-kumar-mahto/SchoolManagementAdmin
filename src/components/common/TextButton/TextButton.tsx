import React from "react";
import styles from "./TextButton.module.css";

interface TextButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

const TextButton: React.FC<TextButtonProps> = ({ onClick, children }) => {
  return (
    <button onClick={onClick} className={styles.textButton} type="button">
      {children}
    </button>
  );
};

export default TextButton;
