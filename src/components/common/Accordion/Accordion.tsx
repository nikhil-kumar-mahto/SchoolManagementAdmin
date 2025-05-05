import React, { useState } from "react";
import "./Accordion.css";
import { UpArrowIcon, DownArrowIcon } from "../../../assets/svgs";

const Accordion = ({ items }) => {
  const [activeIndexes, setActiveIndexes] = useState([0]);

  const togglePanel = (index) => {
    setActiveIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div>
      {items.map((item, index) => (
        <div key={index}>
          <button
            className={`accordion ${
              activeIndexes.includes(index) ? "active" : ""
            }`}
            onClick={() => togglePanel(index)}
            type="button"
            aria-expanded={activeIndexes.includes(index)}
            aria-controls={`panel-${index}`}
            id={`accordion-${index}`}
          >
            {item.title}
            {activeIndexes.includes(index) ? (
              <UpArrowIcon
                className="icon"
                style={{ width: "18px", height: "15px" }}
              />
            ) : (
              <DownArrowIcon
                className="icon"
                style={{ width: "18px", height: "15px" }}
              />
            )}
          </button>
          <div
            id={`panel-${index}`}
            className={`panel ${activeIndexes.includes(index) ? "show" : ""}`}
          >
            {item.content}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Accordion;
