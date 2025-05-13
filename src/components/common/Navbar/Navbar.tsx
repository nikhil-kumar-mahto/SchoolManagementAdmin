import React from "react";
import styles from "./Navbar.module.css";
import Button from "../Button/Button";

interface NavbarProps {
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogout }) => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.rightSection}>
        <Button text="Logout" onClick={onLogout} />
      </div>
    </nav>
  );
};

export default Navbar;
