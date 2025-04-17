import React from "react";
import Button from "../../common/Button/Button";
import TimeEntry from "../TimeEntry/TimeEntry";
import { PlusCircleIcon } from "../../../assets/svgs";

interface Time {
  start_time: string;
  end_time: string;
  subject: string;
  teacher: string;
  handleChange: (
    type: "start_time" | "end_time" | "subject" | "teacher",
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
    type: "start_time" | "end_time" | "subject" | "teacher",
    value: string
  ) => void;
  handleDelete: (index: number, id: string | undefined) => void;
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
    <div className="mb-4">
      <div
        style={{ display: "flex", justifyContent: "space-between" }}
        className="mt-3"
      >
        <h4>{day}</h4>
        <button
          onClick={addItem}
          style={{
            width: "1.875rem",
            height: "1.875rem",
            border: "none",
            outline: "none",
            background: "none",
            cursor: "pointer",
          }}
          type="button"
        >
          <PlusCircleIcon />
        </button>
      </div>
      <p className="mt-2">Enter schedule for {day}</p>

      {schedule.map((item, index) => (
        <TimeEntry
          start_time={item.start_time}
          end_time={item.end_time}
          subject={item.subject}
          teacher={item.teacher}
          handleChange={(
            type: "start_time" | "end_time" | "subject" | "teacher",
            value: string
          ) => handleChange(index, type, value)}
          handleDelete={() => handleDelete(index, item?.id)}
          errors={errors?.[index]}
          teachers={teachers}
        />
      ))}
      <hr />
    </div>
  );
};

export default WeekDay;
