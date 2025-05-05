/* eslint-disable */
// @ts-nocheck


import React from "react";
import styles from "./ToolTip.module.css";

interface TooltipProps {
  text: string;
  showToolTip?: boolean;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({
  text,
  showToolTip = true,
  children,
}) => (
  <div className={styles["tooltip-container"]}>
    {children}
    {showToolTip && <span className={styles["tooltip-text"]}>{text}</span>}
  </div>
);

export default Tooltip;
