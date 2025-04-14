import React, { ChangeEvent } from "react";
import styles from "../../../styles/Forms.module.css";
import Select from "../../../components/common/Select/Select";
import {
  filterTimeArray,
  generateTimeArray,
} from "../../../utils/common/utility-functions";
import DatePicker from "../../DatePicker/DatePicker";

type Options = { label: string; value: string };

interface Props {
  dateState: {
    school: string;
    class_assigned: string;
    subject: string;
    teacher: string;
    start_time: string;
    end_time: string;
    date: string;
  };
  handleChange: (value: string, type: string) => void;
  schools: Array<Options>;
  teachers: Array<Options>;
  classes: Array<Options>;
  subjects: Array<Options>;
  errors: any;
}

const DateSchedule: React.FC<Props> = ({
  dateState,
  handleChange,
  schools,
  teachers,
  classes,
  subjects,
  errors,
}) => {
  return (
    <div className="mt-4">
      <div>
        <div className={`${styles.row} ${styles.selectContainer} mb-2`}>
          <DatePicker
            label="Pick a Date*"
            selectedDate={dateState.date}
            onDateChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleChange(e.target.value, "date")
            }
            error={errors?.date && "Please select date."}
          />
        </div>
        <div className={`${styles.row} ${styles.selectContainer}`}>
          <Select
            label="Select school*"
            options={schools}
            value={dateState?.school}
            onChange={(value: string) => handleChange(value, "school")}
            error={errors?.school && "Please select school."}
          />

          <Select
            label="Select teacher*"
            options={teachers}
            value={dateState?.teacher}
            onChange={(value: string) => handleChange(value, "teacher")}
            error={errors?.teacher && "Please select teacher."}
          />

          <Select
            label="Select class*"
            options={classes}
            value={dateState?.class_assigned}
            onChange={(value: string) => handleChange(value, "class_assigned")}
            error={errors?.class_assigned && "Please select class."}
          />

          <Select
            label="Select subject*"
            options={subjects}
            value={dateState?.subject}
            onChange={(value: string) => handleChange(value, "subject")}
            error={errors?.subject && "Please select subject."}
          />
        </div>

        <div className={`${styles.row} ${styles.selectContainer}`}>
          <Select
            label="Select start time*"
            options={generateTimeArray()}
            value={dateState?.start_time}
            onChange={(value: string) => handleChange(value, "start_time")}
            error={errors?.start_time && "Please select start time."}
          />
          <Select
            label="Select end time*"
            options={filterTimeArray(dateState?.start_time)}
            value={dateState?.end_time}
            onChange={(value: string) => handleChange(value, "end_time")}
            error={errors?.end_time && "Please select end time."}
          />
        </div>
      </div>
    </div>
  );
};

export default DateSchedule;
