import React from "react";
import styles from "./ImagePreview.module.css";

interface ImagePreviewProps {
  imageUrl: string;
  onClose: () => void;
  text: string;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  imageUrl,
  onClose,
  text,
}) => {
  if (!imageUrl) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <span className={styles.title}>{text}</span>
          <button className={styles.closeButton} onClick={onClose}>
            &times;
          </button>
        </div>
        <img src={imageUrl} alt="Preview" className={styles.image} />
      </div>
    </div>
  );
};

export default ImagePreview;
