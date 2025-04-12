import React, { useEffect, useState } from "react";
import styles from "./Sidebar.module.css";
import { SchoolIcon } from "../../../assets/svgs";
import { sidebarItems } from "./SideBarList";
import { Link, useLocation, useNavigate } from "react-router-dom";

interface SidebarProps {
  isMinimized: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isMinimized }) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>("");
  const location = useLocation();
  const navigate = useNavigate();

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

  const handleClick = (selectedItem: string, path: string) => {
    navigate(path);
    setSelectedItem(selectedItem);
  };

  return (
    <aside
      className={`${styles.sidebar} ${!isMinimized ? styles.open : ""} ${
        isMinimized ? styles.minimized : ""
      }`}
    >
      <div
        className={`flex-center ${styles.iconContainer} ${
          isMinimized && styles.minimizedIconSize
        }`}
      >
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
              onClick={() => handleClick(item.name, item.href)}
            >
              <div
                className={`${styles.labelIcon} ${
                  isMinimized && styles.labelIconMinimized
                }`}
              >
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
