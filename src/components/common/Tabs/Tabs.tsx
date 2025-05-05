/* eslint-disable */
// @ts-nocheck


import React, { useState } from "react";
import styles from "./Tabs.module.css";

interface Tab {
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  initialTab?: number;
  className?: string;
  variant?: "primary" | "secondary" | "neutral";
  size?: "small" | "medium" | "large";
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  initialTab = 0,
  className,
  variant = "neutral",
  size = "medium",
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return {
          activeHeader: styles.primaryActiveHeader,
          header: styles.primaryHeader,
        };
      case "secondary":
        return {
          activeHeader: styles.secondaryActiveHeader,
          header: styles.secondaryHeader,
        };
      default:
        return {
          activeHeader: styles.neutralActiveHeader,
          header: styles.neutralHeader,
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return {
          header: styles.smallHeader,
          content: styles.smallContent,
        };
      case "large":
        return {
          header: styles.largeHeader,
          content: styles.largeContent,
        };
      default:
        return {
          header: styles.mediumHeader,
          content: styles.mediumContent,
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <div className={`${styles.tabsContainer} ${className || ""}`}>
      <div className={styles.tabHeaders}>
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`${styles.tabHeader} ${variantStyles.header} ${
              sizeStyles.header
            } ${activeTab === index ? variantStyles.activeHeader : ""}`}
            onClick={() => handleTabClick(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className={`${styles.tabContent} ${sizeStyles.content}`}>
        {tabs[activeTab].content}
      </div>
    </div>
  );
};

export default Tabs;
