import React, { useState } from "react";
import styles from "./Layout.module.css";
import Sidebar from "../Sidebar/Sidebar";
import { Options } from "../../../assets/svgs";
import Button from "../Button/Button";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={styles.layoutContainer}>
      <Sidebar isMinimized={isSidebarOpen} />
      <div className={styles.content}>
        <div className={styles.navbar}>
          <button className={styles.button} onClick={toggleSidebar}>
            <Options />
          </button>
          <Button text="Logout" onClick={() => {}} type="outline" />
        </div>
        {children}
      </div>
    </div>
  );
};

export default Layout;
