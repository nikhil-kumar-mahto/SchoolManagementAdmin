import React, { useEffect, useState } from "react";
import styles from "./Sidebar.module.css";
import { SchoolIcon } from "../../../assets/svgs";
import { sidebarItems } from "./SideBarList";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  isMinimized: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isMinimized }) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>("");
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;
    const matchingItem = sidebarItems.find((item) => {
      const itemPath = item.href;
      return currentPath.startsWith(itemPath);
    });

    if (matchingItem) {
      setSelectedItem(matchingItem.name);
    } else {
      setSelectedItem("Dashboard");
    }
  }, [location.pathname]);

  return (
    <aside
      className={`${styles.sidebar} ${isMinimized || true ? styles.open : ""} ${
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
              <Link
                className={
                  selectedItem === item.name ? styles.anchorHoveredState : ""
                }
                to={item.href}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
