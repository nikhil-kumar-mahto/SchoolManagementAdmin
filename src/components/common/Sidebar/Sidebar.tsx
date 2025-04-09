import React, { useState } from "react";
import styles from "./Sidebar.module.css";
import { SchoolIcon } from "../../../assets/svgs";
import { sidebarItems } from "./SideBarList";

interface SidebarProps {
  isOpen: boolean;
  isMinimized?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, isMinimized }) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>("Dashboard");

  return (
    <aside
      className={`${styles.sidebar} ${isOpen || true ? styles.open : ""} ${
        isMinimized ? styles.minimized : ""
      }`}
    >
      <div className={`flex-center ${styles.iconContainer}`}>
        <SchoolIcon />
      </div>

      <nav>
        <ul>
          {sidebarItems.map((item) => (
            <li
              key={item.name}
              className={`${styles.labelContainer} ${
                hoveredItem === item.name || selectedItem === item.name
                  ? styles.hoverState
                  : ""
              } mb-3`}
              onMouseEnter={() => setHoveredItem(item.name)}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={() => setSelectedItem(item.name)}
            >
              <div className={styles.labelIcon}>
                <item.Icon
                  fill={
                    hoveredItem === item.name || selectedItem === item.name
                      ? "#fff"
                      : item.fill
                  }
                  stroke={
                    hoveredItem === item.name || selectedItem === item.name
                      ? "#fff"
                      : item.stroke
                  }
                />
              </div>
              <a
                className={
                  selectedItem === item.name ? styles.anchorHoveredState : ""
                }
                href={item.href}
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
