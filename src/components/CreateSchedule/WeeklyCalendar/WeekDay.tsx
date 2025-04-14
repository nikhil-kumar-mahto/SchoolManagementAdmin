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
  selectedClass: string;
  handleChange: (
    type: "startTime" | "endTime" | "subject" | "class",
    value: string
  ) => void;
  handleDelete: () => void;
  classes: Array<{ label: string; value: string }>;
  errors: any;
}

type Props = {
  day: string;
  schedule: Array<Time>;
  addItem: () => void;
  handleChange: (
    index: number,
    type: "startTime" | "endTime" | "subject" | "class",
    value: string
  ) => void;
  handleDelete: (index: number) => void;
  classes: Array<{ label: string; value: string }>;
  errors: any;
};

const TimeAndSubject: React.FC<Time> = ({
  startTime,
  endTime,
  subject,
  selectedClass,
  handleChange,
  handleDelete,
  classes,
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

  console.log("errors===", errors);

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
        label="Select class*"
        options={classes}
        value={selectedClass}
        onChange={(value: string) => handleChange("class", value)}
        error={errors?.class && "Please select class."}
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
  classes,
  errors = {},
}) => {
  return (
    <div>
      <h4 className="mt-4">{day}</h4>
      <p className="mt-2">Enter schedule for {day}</p>

      {schedule.map((item, index) => (
        <TimeAndSubject
          startTime={item.startTime}
          endTime={item.endTime}
          subject={item.subject}
          selectedClass={item.class}
          handleChange={(
            type: "startTime" | "endTime" | "subject" | "class",
            value: string
          ) => handleChange(index, type, value)}
          handleDelete={() => handleDelete(index)}
          classes={classes}
          errors={errors?.[index]}
        />
      ))}
      <Button text="Add Time Slot" onClick={addItem} className="mb-4" />
      <hr />
    </div>
  );
};

export default WeekDay;
