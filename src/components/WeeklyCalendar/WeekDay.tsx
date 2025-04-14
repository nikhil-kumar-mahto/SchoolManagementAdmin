import React from "react";
import styles from "./WeekDay.module.css";
import Button from "../common/Button/Button";
import Select from "../common/Select/Select";
import {
  filterTimeArray,
  generateTimeArray,
} from "../../utils/common/utility-functions";
import { useAppContext } from "../../contexts/AppContext";

interface Time {
  startTime: string;
  endTime: string;
  subject: string;
  handleChange: (
    type: "startTime" | "endTime" | "subject",
    value: string
  ) => void;
}

type Props = {
  day: string;
  schedule: Array<Time>;
  addItem: () => void;
  handleChange: (
    index: number,
    type: "startTime" | "endTime" | "subject",
    value: string
  ) => void;
};

const TimeAndSubject: React.FC<Time> = ({
  startTime,
  endTime,
  subject,
  handleChange,
}) => {
  const { subjects } = useAppContext();
  let subjectsFormatted = subjects?.map(
    (item: { name: string; id: string }) => {
      return {
        label: item?.name,
        value: item?.id,
      };
    }
  );
  return (
    <div className={styles.timeAndSubject}>
      <Select
        label="Select start time*"
        options={generateTimeArray()}
        value={startTime}
        onChange={(value: string) => handleChange("startTime", value)}
        // error={errors?.start_time && "Please select start time."}
      />
      <Select
        label="Select end time*"
        options={filterTimeArray(startTime)}
        value={endTime}
        onChange={(value: string) => handleChange("endTime", value)}
        // error={errors?.start_time && "Please select start time."}
      />
      <Select
        label="Select subject*"
        options={subjectsFormatted}
        value={subject}
        onChange={(value: string) => handleChange("subject", value)}
        // error={errors?.start_time && "Please select start time."}
      />
    </div>
  );
};

const WeekDay: React.FC<Props> = ({ day, schedule, addItem, handleChange }) => {
  return (
    <div>
      <h4 className="mt-4">{day}</h4>
      <p className="mt-2">Enter schedule for {day}</p>

      {schedule.map((item, index) => (
        <TimeAndSubject
          startTime={item.startTime}
          endTime={item.endTime}
          subject={item.subject}
          handleChange={(
            type: "startTime" | "endTime" | "subject",
            value: string
          ) => handleChange(index, type, value)}
        />
      ))}
      <Button text="Add Time Slot" onClick={addItem} />
    </div>
  );
};

export default WeekDay;
