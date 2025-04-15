import React from "react";
import Button from "../../common/Button/Button";
import TimeEntry from "../TimeEntry/TimeEntry";

interface Time {
  startTime: string;
  endTime: string;
  subject: string;
  teacher: string;
  handleChange: (
    type: "startTime" | "endTime" | "subject" | "teacher",
    value: string
  ) => void;
  handleDelete: () => void;
  teachers: Array<{ label: string; value: string }>;
  errors: any;
}

type Props = {
  day: string;
  schedule: Array<Time>;
  addItem: () => void;
  handleChange: (
    index: number,
    type: "startTime" | "endTime" | "subject" | "teacher",
    value: string
  ) => void;
  handleDelete: (index: number) => void;
  teachers: Array<{ label: string; value: string }>;
  errors: any;
};

const WeekDay: React.FC<Props> = ({
  day,
  schedule,
  addItem,
  handleChange,
  handleDelete,
  errors = {},
  teachers,
}) => {
  return (
    <div>
      <h4 className="mt-4">{day}</h4>
      <p className="mt-2">Enter schedule for {day}</p>

      {schedule.map((item, index) => (
        <TimeEntry
          startTime={item.startTime}
          endTime={item.endTime}
          subject={item.subject}
          teacher={item.teacher}
          handleChange={(
            type: "startTime" | "endTime" | "subject" | "teacher",
            value: string
          ) => handleChange(index, type, value)}
          handleDelete={() => handleDelete(index)}
          errors={errors?.[index]}
          teachers={teachers}
        />
      ))}
      <Button text="Add Time Slot" onClick={addItem} className="mb-4" />
      <hr />
    </div>
  );
};

export default WeekDay;
