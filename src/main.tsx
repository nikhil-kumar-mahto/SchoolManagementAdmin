import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import ToastProvider from "./contexts/Toast.tsx";
import AppProvider from "./contexts/AppContext.tsx";

createRoot(document.getElementById("root")!).render(
  <ToastProvider>
    <AppProvider>
      <App />
    </AppProvider>
  </ToastProvider>
);
