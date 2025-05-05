/* eslint-disable */
// @ts-nocheck

import React, { createContext, useState, useContext } from "react";
import ReactDOM from "react-dom";

type ToastContextType = {
  show: (message: string, duration?: number, color?: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

type ToastProviderProps = {
  children: React.ReactNode;
};

const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toast, setToast] = useState<{ message: string; color: string } | null>(
    null
  );
  const [visible, setVisible] = useState(false);
  const [progressStyle, setProgressStyle] = useState({
    width: "0%",
    transition: "none",
  });

  const show = (message: string, duration = 3000, color = "#333") => {
    setToast({ message, color });
    setVisible(true);

    // Reset progress bar
    setProgressStyle({ width: "0%", transition: "none" });

    // Trigger the progress bar animation
    setTimeout(() => {
      setProgressStyle({
        width: "100%",
        transition: `width ${duration}ms linear`,
      });
    }, 10); // Small delay to ensure the style update is applied

    // Automatically hide the toast after the duration
    setTimeout(() => {
      setVisible(false);
      setProgressStyle({ width: "0%", transition: "none" });
    }, duration);
  };

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {ReactDOM.createPortal(
        <div
          className={`toast-container ${visible ? "visible" : ""}`}
          style={{ backgroundColor: toast?.color }}
        >
          {toast?.message}
          <div className="toast-progress-bar" style={progressStyle}></div>
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export default ToastProvider;
