import { DeleteIcon } from "../../../assets/svgs";
import { useAppContext } from "../../../contexts/AppContext";
import styles from "./TimeEntry.module.css";
import {
  filterTimeArray,
  generateTimeArray,
} from "../../../utils/common/utility-functions";
import Select from "../../common/Select/Select";

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

export default TimeEntry;
