import React from "react";
import styles from "./WeekDay.module.css";
import Button from "../../common/Button/Button";
import Select from "../../common/Select/Select";
import {
  filterTimeArray,
  generateTimeArray,
} from "../../../utils/common/utility-functions";
import { useAppContext } from "../../../contexts/AppContext";
import { DeleteIcon } from "../../../assets/svgs";

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
  // classes: Array<{ label: string; value: string }>;
  teachers: Array<{ label: string; value: string }>;
  errors: any;
};

const TimeEntry: React.FC<Time> = ({
  startTime,
  endTime,
  subject,
  teacher,
  handleChange,
  handleDelete,
  teachers,
  errors = {},
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
        error={errors?.startTime && "Please select start time."}
      />
      <Select
        label="Select end time*"
        options={filterTimeArray(startTime)}
        value={endTime}
        onChange={(value: string) => handleChange("endTime", value)}
        error={errors?.endTime && "Please select end time."}
      />

      <Select
        label="Select teacher*"
        options={teachers}
        value={teacher}
        onChange={(value: string) => handleChange("teacher", value)}
        error={errors?.teacher && "Please select teacher."}
      />

      <Select
        label="Select subject*"
        options={subjectsFormatted}
        value={subject}
        onChange={(value: string) => handleChange("subject", value)}
        error={errors?.subject && "Please select subject."}
      />
      <button className={styles.iconContainer} onClick={handleDelete}>
        <DeleteIcon />
      </button>
    </div>
  );
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
