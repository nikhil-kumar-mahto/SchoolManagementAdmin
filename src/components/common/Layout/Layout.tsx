import React from "react";
import styles from "./Layout.module.css";
import Sidebar from "../Sidebar/Sidebar";
import { SideBarLeft, SideBarRight } from "../../../assets/svgs";
import Button from "../Button/Button";
import { useAppContext } from "../../../contexts/AppContext";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isSidebarOpen, toggleSidebar } = useAppContext();
  const { toggleIsLoggedIn } = useAppContext();

  const handleLogout = () => {
    localStorage.clear();
    toggleIsLoggedIn();
  };

  return (
    <div className={styles.layoutContainer}>
      <Sidebar isMinimized={isSidebarOpen} />
      <div className={styles.content}>
        <div className={styles.navbar}>
          <button className={styles.button} onClick={toggleSidebar}>
            {!isSidebarOpen ? <SideBarLeft /> : <SideBarRight />}
          </button>
          <Button text="Logout" onClick={handleLogout} type="outline" />
        </div>
        {children}
      </div>
    </div>
  );
};

export default Layout;
