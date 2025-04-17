import React, { ChangeEvent, useState } from "react";
import DatePicker from "../../DatePicker/DatePicker";
import TimeEntry from "../TimeEntry/TimeEntry";
import { PlusCircleIcon } from "../../../assets/svgs";
import Modal from "../../common/Modal/Modal";

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
  handleDelete: (index: number, id: string | undefined) => void;
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
  let disableAddingMore =
    !!errors?.schedule?.length ||
    !schedule[schedule.length - 1]?.start_time ||
    !schedule[schedule.length - 1]?.end_time ||
    !schedule[schedule.length - 1]?.teacher ||
    !schedule[schedule.length - 1]?.subject;

  console.log(
    "check===",
    !!errors?.schedule?.length,
    !!schedule[schedule.length - 1]?.start_time
  );

  const [showModal, setShowModal] = useState(false);
  const handleAddMore = () => {
    if (disableAddingMore) {
      setShowModal(true);
    } else {
      addItem();
    }
  };
  return (
    <>
      <div className="mt-4">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h4>Select Date</h4>
          <button
            onClick={handleAddMore}
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

        <p className="mt-2">Enter schedule for a particular date</p>
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
          />
        ))}
      </div>
      <Modal
        title="Alert!"
        message="Please ensure all fields are filled out correctly before adding more time slots."
        onConfirm={() => setShowModal(false)}
        visible={showModal}
        confirmText="OK"
      />
    </>
  );
};

export default DateSchedule;
