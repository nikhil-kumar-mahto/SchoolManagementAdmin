import React, { useState } from "react";
import styles from "./TimeSelect.module.css"; // Import the module CSS

interface TimeSelectProps {
  value: string;
  onChange: (time: string) => void;
  label?: string;
  className?: string;
}

const TimeSelect: React.FC<TimeSelectProps> = ({
  value,
  onChange,
  label,
  className,
}) => {
  const [selectedTime, setSelectedTime] = useState<string>(value);

  const handleTimeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const time = event.target.value;
    setSelectedTime(time);
    onChange(time);
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      const formattedHour = hour.toString().padStart(2, "0");
      const time = `${formattedHour}:00`;
      options.push(
        <option key={time} value={time}>
          {time}
        </option>
      );
    }
    return options;
  };

  return (
    <div className={`${styles.timeSelectContainer} ${className || ""}`}>
      {label && <label>{label}</label>}
      <select value={selectedTime} onChange={handleTimeChange}>
        {generateTimeOptions()}
      </select>
    </div>
  );
};

export default TimeSelect;
