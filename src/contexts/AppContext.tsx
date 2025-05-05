/* eslint-disable */
// @ts-nocheck


import React, { createContext, useState, useContext, useEffect } from "react";
import Fetch from "../utils/form-handling/fetch.js";
import Modal from "../components/common/Modal/Modal";
import Auth from "../utils/form-handling/auth.js";

type AppContextType = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  subjects: { label: string; value: string }[];
  schools: {
    label: string;
    value: string;
    classes: { id: string; name: string, section: string }[];
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
  const [showModal, setShowModal] = useState(false);

  const toggleIsLoggedIn = () => {
    setIsLoggedIn((prevState) => !prevState);
  };

  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    return !!token;
  };

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
    // setIsLoggedIn(true);
  }, []);

  useEffect(() => {
    const handleUnauthorized = (e) => {
      setShowModal(true);
    };

    window.addEventListener("unauthorizedError", handleUnauthorized);

    return () => {
      window.removeEventListener("unauthorizedError", handleUnauthorized);
    };
  }, []);

  const getSchools = () => {
    Fetch("schools/?limit=40&offset=0&is_active=true").then((res: any) => {
      if (res.status) {
        let schools = res.data?.results?.map(
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
    Fetch("subjects/?limit=40&offset=0").then((res: any) => {
      if (res.status) {
        setSubjects(res.data?.results);
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

  const handleLogout = () => {
    setShowModal(false);
    localStorage.clear();
    Auth.clearToken();
    toggleIsLoggedIn();
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
      <Modal
        title="Alert!"
        message="You have been logged out. Please login again."
        onConfirm={handleLogout}
        visible={showModal}
        confirmText="OK"
      />
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within a AppProvider");
  }
  return context;
};

export default AppProvider;
