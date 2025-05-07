import React, { ChangeEvent } from "react";
import DatePicker from "../../DatePicker/DatePicker";
import TimeEntry from "../TimeEntry/TimeEntry";
import { PlusCircleIcon } from "../../../assets/svgs";
import moment from "moment";

type Options = { label: string; value: string };

interface Time {
  start_time: string;
  end_time: string;
  subject: string;
  teacher: string;
  id?: string;
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
  handleDelete: (index: number, id: string | undefined) => void;
  isEditMode?: boolean;
  disableEdit?: boolean;
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
  isEditMode,
  disableEdit,
}) => {
  let disableAddingMore =
    !!errors?.schedule?.length ||
    !schedule[schedule.length - 1]?.start_time ||
    !schedule[schedule.length - 1]?.end_time ||
    !schedule[schedule.length - 1]?.teacher ||
    !schedule[schedule.length - 1]?.subject;

  if (schedule.length === 0) {
    disableAddingMore = false;
  }

  const allowLastEntryDelete = () => {
    if (schedule.length > 1 || isEditMode) {
      return true;
    }
    return false;
  };

  return (
    <>
      <div className="mt-4">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h4>Select Date</h4>
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
            disabled={disableEdit}
            type="button"
          >
            <PlusCircleIcon />
          </button>
        </div>

        <p className="mt-2">Enter schedule for a particular date</p>
        <DatePicker
          label="Pick a Date*"
          selectedDate={dateState.date}
          onDateChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleChange(e.target.value, "date")
          }
          error={errors?.date}
          disabled={isEditMode}
          min={moment().format("YYYY-MM-DD")}
        />
        {schedule.map((item, index) => (
          <TimeEntry
            key={index}
            start_time={item.start_time}
            end_time={item.end_time}
            subject={item.subject}
            teacher={item.teacher}
            handleChange={(
              type: "start_time" | "end_time" | "subject" | "teacher",
              value: string
            ) => handleTimeChange(index, type, value)}
            handleDelete={() => handleDelete(index, item?.id)}
            errors={errors?.schedule?.[index]}
            teachers={teachers}
            minStartTime={index > 0 ? schedule[index - 1].end_time : undefined}
            dateArray={dateState}
            disabled={disableEdit}
            allowLastEntryDelete={allowLastEntryDelete()}
          />
        ))}
      </div>
    </>
  );
};

export default DateSchedule;
