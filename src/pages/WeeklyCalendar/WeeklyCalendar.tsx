import React, { useState } from "react";
import styles from "./WeeklyCalendar.module.css";
import Layout from "../../components/common/Layout/Layout";
import { useParams } from "react-router-dom";
import WeekDay from "../../components/WeeklyCalendar/WeekDay";

type Day = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";

interface Time {
  startTime: string;
  endTime: string;
  subject: string;
}

interface Props {
  Monday: Array<Time>;
  Tuesday: Array<Time>;
  Wednesday: Array<Time>;
  Thursday: Array<Time>;
  Friday: Array<Time>;
}

const initialState = {
  Monday: [],
  Tuesday: [],
  Wednesday: [],
  Thursday: [],
  Friday: [],
};

const emptyObj = { startTime: "", endTime: "", subject: "" };

const WeeklyCalendar: React.FC = () => {
  const [data, setData] = useState<Props>(initialState);
  const { id } = useParams();

  const addItem = (day: Day) => {
    setData((prevState) => {
      return {
        ...prevState,
        [day]: [...prevState[day], emptyObj],
      };
    });
  };

  const handleChange = (
    day: Day,
    index: number,
    type: "startTime" | "endTime" | "subject",
    value: string
  ) => {
    setData((prevState) => {
      const updatedDay = [...prevState[day]];
      const updatedTime = { ...updatedDay[index] };

      updatedTime[type] = value;
      updatedDay[index] = updatedTime;

      return {
        ...prevState,
        [day]: updatedDay,
      };
    });
  };

  return (
    <Layout>
      <div className={styles.container}>
        <h2>{id ? "Update" : "Create"} Schedule</h2>
        {Object.entries(data).map(([key, value]) => (
          <WeekDay
            day={key}
            schedule={value}
            addItem={() => addItem(key as Day)}
            handleChange={(
              index: number,
              type: "startTime" | "endTime" | "subject",
              value: string
            ) => handleChange(key as Day, index, type, value)}
          />
        ))}
      </div>
    </Layout>
  );
};

export default WeeklyCalendar;
