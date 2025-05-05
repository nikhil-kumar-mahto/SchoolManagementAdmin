/* eslint-disable */
// @ts-nocheck


import React from "react";
import styles from "./Modal.module.css";
import Button from "../Button/Button";

interface ModalProps {
  title: string;
  message: string;
  onCancel?: () => void;
  onConfirm: () => void;
  cancelText?: string;
  confirmText?: string;
  className?: string;
  visible: boolean;
  isLoading?: boolean;
  primaryButtonVariant?: "primary" | "danger";
}

const Modal: React.FC<ModalProps> = ({
  title,
  message,
  onCancel,
  onConfirm,
  cancelText = "Cancel",
  confirmText = "Confirm",
  className,
  visible,
  isLoading,
  primaryButtonVariant = "primary",
}) => {
  if (!visible) {
    return null;
  }

  return (
    <div className={`${styles.modalOverlay} ${className || ""}`}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>{title}</h2>
        <p className={styles.modalMessage}>{message}</p>
        <div className={styles.modalButtons}>
          {cancelText && onCancel && (
            <Button
              text={cancelText}
              onClick={onCancel}
              type="outline"
              className={styles.cancelButton}
              style={{ width: "6rem" }}
            />
          )}

          <Button
            text={confirmText}
            onClick={onConfirm}
            className={
              primaryButtonVariant === "primary"
                ? styles.confirmButton
                : styles.errorButton
            }
            isLoading={isLoading}
            style={{ width: "6rem" }}
            variant={primaryButtonVariant}
          />
        </div>
      </div>
    </div>
  );
};

export default Modal;
