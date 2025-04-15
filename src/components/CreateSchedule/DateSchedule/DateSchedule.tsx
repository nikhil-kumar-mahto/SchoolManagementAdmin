import React, { ChangeEvent } from "react";
import DatePicker from "../../DatePicker/DatePicker";
import TimeEntry from "../TimeEntry/TimeEntry";
import Button from "../../common/Button/Button";

type Options = { label: string; value: string };

interface Time {
  start_time: string;
  end_time: string;
  subject: string;
  teacher: string;
}

interface Props {
  dateState: {
    schedule: {
      subject: string;
      teacher: string;
      start_time: string;
      end_time: string;
    }[];
    date: string;
  };
  handleChange: (value: string, type: string) => void;
  teachers: Array<Options>;
  subjects: Array<Options>;
  errors: any;
  schedule: Array<Time>;
  handleTimeChange: (
    index: number,
    type: "start_time" | "end_time" | "subject" | "teacher",
    value: string
  ) => void;
  addItem: () => void;
  handleDelete: (index: number) => void;
}

const DateSchedule: React.FC<Props> = ({
  dateState,
  handleChange,
  handleTimeChange,
  teachers,
  errors,
  schedule,
  addItem,
  handleDelete,
}) => {
  return (
    <div className="mt-4">
      <DatePicker
        label="Pick a Date*"
        selectedDate={dateState.date}
        onDateChange={(e: ChangeEvent<HTMLInputElement>) =>
          handleChange(e.target.value, "date")
        }
        error={errors?.date}
      />
      {schedule.map((item, index) => (
        <TimeEntry
          start_time={item.start_time}
          end_time={item.end_time}
          subject={item.subject}
          teacher={item.teacher}
          handleChange={(
            type: "start_time" | "end_time" | "subject" | "teacher",
            value: string
          ) => handleTimeChange(index, type, value)}
          handleDelete={() => handleDelete(index)}
          errors={errors?.schedule?.[index]}
          teachers={teachers}
        />
      ))}
      <Button text="Add Time Slot" onClick={addItem} className="mb-4" />
    </div>
  );
};

export default DateSchedule;
