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
  minStartTime?: undefined | number | string;
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
        options={
          minStartTime ? filterTimeArray(minStartTime) : generateTimeArray()
        }
        value={start_time}
        onChange={(value: string) => handleChange("start_time", value)}
        error={errors?.start_time}
      />

      <Select
        label="Select end time*"
        options={filterTimeArray(start_time)}
        value={end_time}
        onChange={(value: string) => handleChange("end_time", value)}
        error={errors?.end_time}
      />

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
