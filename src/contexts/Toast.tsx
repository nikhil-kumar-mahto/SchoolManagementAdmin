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
  const [progress, setProgress] = useState(0);

  const show = (message: string, duration = 3000, color = "#333") => {
    setToast({ message, color });
    setVisible(true);
    setProgress(0);

    const interval = 10;
    const step = 100 / (duration / interval);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step;
        if (next >= 100) {
          clearInterval(progressInterval);
        }
        return next;
      });
    }, interval);

    setTimeout(() => {
      setVisible(false);
      setProgress(0);
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
          <div
            className="toast-progress-bar"
            style={{ width: `${progress}%` }}
          ></div>
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
