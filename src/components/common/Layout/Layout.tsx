// Layout.js
import React, { useState } from "react";
import styles from "./Layout.module.css";
import Sidebar from "../Sidebar/Sidebar";
import { Options } from "../../../assets/svgs";

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
      <Sidebar isOpen={isSidebarOpen} />
      <div className={styles.content}>
        <button className={styles.button} onClick={toggleSidebar}>
          <Options />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Layout;
