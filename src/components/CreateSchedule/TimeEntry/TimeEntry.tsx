import { DeleteIcon } from "../../../assets/svgs";
import { useAppContext } from "../../../contexts/AppContext";
import styles from "./TimeEntry.module.css";
import {
  filterTimeArray,
  generateTimeArray,
} from "../../../utils/common/utility-functions";
import Select from "../../common/Select/Select";

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
  minStartTime?: undefined | string;
  dateArray: {
    schedule: {
      subject: string;
      teacher: string;
      start_time: string;
      end_time: string;
    }[];
    date?: string;
  };
  disabled?: boolean;
  allowLastEntryDelete?: boolean;
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
  dateArray,
  errors = {},
  disabled = false,
  allowLastEntryDelete = true,
}) => {
  const { subjects } = useAppContext();
  let subjectsFormatted = subjects?.map((item) => {
    return {
      label: item?.name,
      value: item?.id,
    };
  });

  return (
    <div className={styles.timeAndSubject}>
      <Select
        label="Select start time*"
        options={
          minStartTime
            ? filterTimeArray(minStartTime, dateArray, "start_time")
            : generateTimeArray()
        }
        value={start_time}
        onChange={(value: string) => handleChange("start_time", value)}
        error={errors?.start_time}
        type="time"
        allowEmpty={false}
        disabled={disabled}
      />

      <Select
        label="Select end time*"
        options={filterTimeArray(start_time, dateArray, "end_time")}
        value={end_time}
        onChange={(value: string) => handleChange("end_time", value)}
        error={errors?.end_time}
        type="time"
        disabled={!start_time}
        allowEmpty={false}
      />

      <Select
        label="Select teacher*"
        options={teachers}
        value={teacher}
        onChange={(value: string) => handleChange("teacher", value)}
        error={errors?.teacher}
        disabled={disabled}
      />

      <Select
        label="Select subject*"
        options={subjectsFormatted}
        value={subject}
        onChange={(value: string) => handleChange("subject", value)}
        error={errors?.subject}
        disabled={disabled}
      />
      {!disabled && allowLastEntryDelete && (
        <button
          className={styles.iconContainer}
          onClick={handleDelete}
          type="button"
        >
          <DeleteIcon />
        </button>
      )}
    </div>
  );
};

export default TimeEntry;
