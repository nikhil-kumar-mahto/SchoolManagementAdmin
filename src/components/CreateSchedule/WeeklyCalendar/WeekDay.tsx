import React, { useState } from "react";
import TimeEntry from "../TimeEntry/TimeEntry";
import { PlusCircleIcon } from "../../../assets/svgs";
import Modal from "../../common/Modal/Modal";

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
}

type Props = {
  day: string;
  schedule: Array<Time>;
  addItem: () => void;
  handleChange: (
    index: number,
    type: "start_time" | "end_time" | "subject" | "teacher",
    value: string,
    id: string | undefined
  ) => void;
  handleDelete: (index: number, id: string | undefined) => void;
  teachers: Array<{ label: string; value: string }>;
  errors: any;
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
  let disableAddingMore =
    !!errors?.length ||
    !schedule[schedule.length - 1]?.start_time ||
    !schedule[schedule.length - 1]?.end_time ||
    !schedule[schedule.length - 1]?.teacher ||
    !schedule[schedule.length - 1]?.subject;

  if (schedule.length === 0) {
    disableAddingMore = false;
  }

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
      <div className="mb-4">
        <div
          style={{ display: "flex", justifyContent: "space-between" }}
          className="mt-3"
        >
          <h4>{day}</h4>
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
        <p className="mt-2">Enter schedule for {day}</p>

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
            ) => handleChange(index, type, value, item?.id)}
            handleDelete={() => handleDelete(index, item?.id)}
            errors={errors?.[index]}
            teachers={teachers}
            minStartTime={index > 0 ? schedule[index - 1].end_time : undefined}
          />
        ))}
        <hr />
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

export default WeekDay;
