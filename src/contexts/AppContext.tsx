import React, { createContext, useState, useContext, useEffect } from "react";
import Fetch from "../utils/form-handling/fetch";

type AppContextType = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  subjects: Array<Object>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

type AppProviderProps = {
  children: React.ReactNode;
};

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [subjects, setSubjects] = useState([]);

  const getSubjects = () => {
    Fetch("subjects/").then((res: any) => {
      if (res.status) {
        setSubjects(res.data);
      }
    });
  };

  useEffect(() => {
    getSubjects();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  return (
    <AppContext.Provider value={{ isSidebarOpen, toggleSidebar, subjects }}>
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
