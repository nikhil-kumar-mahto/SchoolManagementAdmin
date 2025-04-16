import { DeleteIcon } from "../../../assets/svgs";
import { useAppContext } from "../../../contexts/AppContext";
import styles from "./TimeEntry.module.css";
import {
  filterTimeArray,
  generateTimeArray,
} from "../../../utils/common/utility-functions";
import Select from "../../common/Select/Select";
import DatePicker from "../../DatePicker/DatePicker";
import { ChangeEvent } from "react";

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
  minStartTime?: undefined | number | string;
  minEndTime?: undefined | number | string;
}

const TimeEntry: React.FC<Time> = ({
  start_time,
  end_time,
  subject,
  teacher,
  handleChange,
  handleDelete,
  teachers,
  minStartTime = undefined,
  minEndTime = undefined,
  index,
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

  console.log(minStartTime, minEndTime, index, "min====");

  return (
    <div className={styles.timeAndSubject}>
      <Select
        label="Select start time*"
        options={generateTimeArray()}
        value={start_time}
        onChange={(value: string) => handleChange("start_time", value)}
        error={errors?.start_time}
      />
      {/* <DatePicker
        label="Select start time*"
        selectedDate={start_time}
        onDateChange={(e: ChangeEvent<HTMLInputElement>) =>
          handleChange("start_time", e.target.value)
        }
        error={errors?.start_time}
        type="time"
        className="w-100"
        min={minStartTime}
      /> */}
      <Select
        label="Select end time*"
        options={filterTimeArray(start_time)}
        value={end_time}
        onChange={(value: string) => handleChange("end_time", value)}
        error={errors?.end_time}
      />
      {/* <DatePicker
        label="Select end time*"
        selectedDate={end_time}
        onDateChange={(e: ChangeEvent<HTMLInputElement>) =>
          handleChange("end_time", e.target.value)
        }
        error={errors?.end_time}
        type="time"
        className="w-100"
        min={minEndTime}
      /> */}

      <Select
        label="Select teacher*"
        options={teachers}
        value={teacher}
        onChange={(value: string) => handleChange("teacher", value)}
        error={errors?.teacher}
      />

      <Select
        label="Select subject*"
        options={subjectsFormatted}
        value={subject}
        onChange={(value: string) => handleChange("subject", value)}
        error={errors?.subject}
      />

      <button className={styles.iconContainer} onClick={handleDelete}>
        <DeleteIcon />
      </button>
    </div>
  );
};

export default TimeEntry;
