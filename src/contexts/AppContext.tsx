import React, { createContext, useState, useContext } from "react";

type AppContextType = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

type AppProviderProps = {
  children: React.ReactNode;
};

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  return (
    <AppContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useToast must be used within a AppProvider");
  }
  return context;
};

export default AppProvider;
