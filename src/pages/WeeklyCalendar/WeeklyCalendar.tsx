import React, { useEffect, useState } from "react";
import styles from "./WeeklyCalendar.module.css";
import Layout from "../../components/common/Layout/Layout";
import { useNavigate, useParams } from "react-router-dom";
import WeekDay from "../../components/CreateSchedule/WeeklyCalendar/WeekDay";
import DateSchedule from "../../components/CreateSchedule/DateSchedule/DateSchedule";
import Fetch from "../../utils/form-handling/fetch";
import { FormC } from "../../utils/form-handling/validate";
import { arrayString } from "../../utils/form-handling/arrayString";
import Select from "../../components/common/Select/Select";
import { useToast } from "../../contexts/Toast";
import Button from "../../components/common/Button/Button";

type Day = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";

interface Time {
  startTime: string;
  endTime: string;
  subject: string;
  class: string;
}

interface Props {
  Monday: Array<Time>;
  Tuesday: Array<Time>;
  Wednesday: Array<Time>;
  Thursday: Array<Time>;
  Friday: Array<Time>;
}

const emptyObj = { startTime: "", endTime: "", class: "", subject: "" };

const initialState = {
  Monday: [emptyObj],
  Tuesday: [emptyObj],
  Wednesday: [emptyObj],
  Thursday: [emptyObj],
  Friday: [emptyObj],
};

const initialState2 = {
  school: "",
  class_assigned: "",
  subject: "",
  teacher: "",
  start_time: "",
  end_time: "",
  date: "",
};

const WeeklyCalendar: React.FC = () => {
  const [data, setData] = useState<Props>(initialState);
  const [viewMode, setViewMode] = useState<"date" | "day">("date");
  const [classes, setClasses] = useState([]);
  const [schools, setSchools] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [otherInfo, setOtherInfo] = useState({
    school: "",
    teacher: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [dateState, setDateState] = useState(initialState2);

  const { id } = useParams();

  const toast = useToast();

  const showToast = (message: string) => {
    toast.show(message, 2000, "#4CAF50");
  };

  const navigate = useNavigate();

  const getScheduleInfo = () => {
    Fetch(`schedule/${id}/`).then((res: any) => {
      if (res.status) {
        // setData(res.data);
      }
    });
  };

  const getSubjects = () => {
    Fetch("subjects/").then((res: any) => {
      if (res.status) {
        let subjects = res.data?.map(
          (item: { name: string; id: string; section: string }) => {
            return {
              label: item?.name,
              value: item?.id,
            };
          }
        );
        setSubjects(subjects);
      }
    });
  };

  const getSchools = () => {
    Fetch("schools/").then((res: any) => {
      if (res.status) {
        let schools = res.data?.map((item: { name: string; id: string }) => {
          return {
            label: item?.name,
            value: item?.id,
          };
        });
        setSchools(schools);
      }
    });
  };

  const getTeachers = () => {
    Fetch("teachers/").then((res: any) => {
      if (res.status) {
        let teachers = res.data?.map((item: { name: string; id: string }) => {
          return {
            label: item?.name,
            value: item?.id,
          };
        });
        setTeachers(teachers);
      }
    });
  };

  const getClasses = () => {
    Fetch("classes/").then((res: any) => {
      if (res.status) {
        let classes = res.data?.map(
          (item: { name: string; id: string; section: string }) => {
            return {
              label: item?.name + " " + item?.section,
              value: item?.id,
            };
          }
        );
        setClasses(classes);
      }
    });
  };

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
    type: "startTime" | "endTime" | "subject" | "class",
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

  const handleDateStateChange = (value: string, type: string) => {
    setDateState((prevData) => ({
      ...prevData,
      [type]: value,
      ...(type === "start_time" && { end_time: "" }),
    }));
  };

  const handleDelete = (day: Day, index: number) => {
    setData((prevState) => {
      const updatedDay = [...prevState[day]];
      updatedDay.splice(index, 1);

      return {
        ...prevState,
        [day]: updatedDay,
      };
    });
  };

  useEffect(() => {
    getSchools();
    getTeachers();
    getClasses();
    getSubjects();

    if (id) {
      getScheduleInfo();
    }
  }, []);

  const navigateBack = () => {
    navigate("/schedule");
  };

  const handleOtherInfoChange = (value: string, type: string) => {
    setOtherInfo((prevState) => {
      return {
        ...prevState,
        [type]: value,
      };
    });
  };

  const onSubmit = () => {
    setIsLoading(true);
    let url = "";
    if (id) {
      url = `schedule/${id}/`;
    } else {
      url = "schedule/";
    }
    Fetch(url, data, { method: id ? "patch" : "post" }).then((res: any) => {
      if (res.status) {
        showToast(
          id ? "Schedule updated successfully" : "Schedule added successfully"
        );
        navigate("/schedule");
      } else {
        let resErr = arrayString(res);
        handleNewError(resErr);
      }
      setIsLoading(false);
    });
  };

  const changeViewMode = (type: "date" | "day") => {
    setViewMode(type);
    removeAllError();
  };

  const { errors, handleSubmit, handleNewError, removeAllError } = FormC({
    values: viewMode === "day" ? data : dateState,
    onSubmit,
  });

  console.log("err===", errors);

  return (
    <Layout>
      <form action="" onSubmit={handleSubmit}>
        <div className={styles.container}>
          <h2>{id ? "Update" : "Create"} Schedule</h2>

          <div className={`${styles.viewToggle} mt-3`}>
            <button
              type="button"
              className={`${styles.toggleButton} ${
                viewMode === "date" ? styles.active : ""
              }`}
              onClick={() => changeViewMode("date")}
            >
              Date
            </button>
            <button
              type="button"
              className={`${styles.toggleButton} ${
                viewMode === "day" ? styles.active : ""
              }`}
              onClick={() => changeViewMode("day")}
            >
              Day
            </button>
          </div>

          {viewMode === "day" ? (
            <>
              <div className={`${styles.schoolAndTeacher} mt-4`}>
                <Select
                  label="Select school*"
                  options={schools}
                  value={otherInfo?.school}
                  onChange={(value: string) =>
                    handleOtherInfoChange(value, "school")
                  }
                  error={errors?.school && "Please select school."}
                />

                <Select
                  label="Select teacher*"
                  options={teachers}
                  value={otherInfo?.teacher}
                  onChange={(value: string) =>
                    handleOtherInfoChange(value, "teacher")
                  }
                  error={errors?.teacher && "Please select teacher."}
                />
              </div>
              {Object.entries(data).map(([key, value]) => (
                <WeekDay
                  day={key}
                  schedule={value}
                  addItem={() => addItem(key as Day)}
                  handleChange={(
                    index: number,
                    type: "startTime" | "endTime" | "subject" | "class",
                    value: string
                  ) => handleChange(key as Day, index, type, value)}
                  handleDelete={(index: number) =>
                    handleDelete(key as Day, index)
                  }
                  classes={classes}
                  errors={errors?.[key]}
                />
              ))}
            </>
          ) : (
            <DateSchedule
              dateState={dateState}
              handleChange={(value: string, type: string) =>
                handleDateStateChange(value, type)
              }
              schools={schools}
              teachers={teachers}
              classes={classes}
              subjects={subjects}
              errors={errors}
            />
          )}
          <div className={styles.buttonContainer}>
            <Button
              text="Cancel"
              type="outline"
              onClick={navigateBack}
              className="mt-2 mr-4"
              style={{ width: "8rem" }}
            />
            <Button
              text={id ? "Update" : "Submit"}
              onClick={handleSubmit}
              className="mt-2"
              isLoading={isLoading}
              style={{ width: "8rem" }}
            />
          </div>
        </div>
      </form>
    </Layout>
  );
};

export default WeeklyCalendar;
