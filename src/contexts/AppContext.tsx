import React, { createContext, useState, useContext, useEffect } from "react";
import Fetch from "../utils/form-handling/fetch";

type AppContextType = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  subjects: { label: string; value: string }[];
  schools: {
    label: string;
    value: string;
    classes: { id: string; name: string }[];
  }[];
  toggleIsLoggedIn: () => void;
  isLoggedIn: boolean | null;
  getSchools: () => void;
  getSubjects: () => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

type AppProviderProps = {
  children: React.ReactNode;
};

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState<null | boolean>(null);
  const [schools, setSchools] = useState([]);

  const toggleIsLoggedIn = () => {
    setIsLoggedIn((prevState) => !prevState); 
  };

  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    return !!token;
  };

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
    // setIsLoggedIn(true)
  }, []);

  const getSchools = () => {
    Fetch("schools/").then((res: any) => {
      if (res.status) {
        let schools = res.data?.map(
          (item: {
            name: string;
            id: string;
            classes: { id: string; name: string }[];
          }) => {
            return {
              label: item?.name,
              value: item?.id,
              classes: item?.classes,
            };
          }
        );
        setSchools(schools);
      }
    });
  };

  const getSubjects = () => {
    Fetch("subjects/").then((res: any) => {
      if (res.status) {
        setSubjects(res.data);
      }
    });
  };

  useEffect(() => {
    if (isLoggedIn) {
      getSubjects();
      getSchools();
    }
  }, [isLoggedIn]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  return (
    <AppContext.Provider
      value={{
        isSidebarOpen,
        toggleSidebar,
        subjects,
        schools,
        toggleIsLoggedIn,
        isLoggedIn,
        getSchools,
        getSubjects,
      }}
    >
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
