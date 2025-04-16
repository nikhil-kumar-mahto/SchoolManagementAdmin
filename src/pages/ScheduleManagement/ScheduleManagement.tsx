import React, { useEffect, useState } from "react";
import styles from "./ScheduleManagement.module.css";
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
  start_time: string;
  end_time: string;
  subject: string;
  teacher: string;
}

interface Props {
  Monday: Array<Time>;
  Tuesday: Array<Time>;
  Wednesday: Array<Time>;
  Thursday: Array<Time>;
  Friday: Array<Time>;
}

const emptyObj = { start_time: "", end_time: "", teacher: "", subject: "" };

// when user selects day
const initialState = {
  Monday: [emptyObj],
  Tuesday: [emptyObj],
  Wednesday: [emptyObj],
  Thursday: [emptyObj],
  Friday: [emptyObj],
};

// when user selects date
const initialState2 = {
  date: "",
  schedule: [emptyObj],
};

const ScheduleManagement: React.FC = () => {
  const [commonInfo, setCommonInfo] = useState({
    school: "",
    class_assigned: "",
  });
  const [dayState, setDayState] = useState<Props>(initialState); // when user selects day
  const [dateState, setDateState] = useState(initialState2); // when user selects date
  const [viewMode, setViewMode] = useState<"date" | "day">("date");
  const [classes, setClasses] = useState([]);
  const [schools, setSchools] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { id } = useParams();

  const toast = useToast();

  const showToast = (message: string) => {
    toast.show(message, 2000, "#4CAF50");
  };

  const navigate = useNavigate();

  const getScheduleInfo = () => {
    Fetch(`schedule/${id}/`).then((res: any) => {
      if (res.status) {
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
            label: item?.first_name + " " + item?.last_name,
            value: item?.id,
          };
        });
        setTeachers(teachers);
      }
    });
  };

  const getClasses = (id: string) => {
    Fetch(`classes?school_id=${id}`).then((res: any) => {
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

  const addItem = (type: "day" | "date", day: Day = "Monday") => {
    if (type === "day") {
      setDayState((prevState) => {
        return {
          ...prevState,
          [day]: [...prevState[day], emptyObj],
        };
      });
    } else {
      setDateState((prevState) => {
        return {
          ...prevState,
          schedule: [...prevState.schedule, emptyObj],
        };
      });
    }
  };

  const handleChange = (
    day: Day,
    index: number,
    type: "start_time" | "end_time" | "subject" | "teacher",
    value: string
  ) => {
    setDayState((prevState) => {
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

  const handleDelete = (
    index: number,
    type: "day" | "date",
    day: Day = "Monday"
  ) => {
    if (type === "day") {
      setDayState((prevState) => {
        const updatedDay = [...prevState[day]];
        updatedDay.splice(index, 1);

        return {
          ...prevState,
          [day]: updatedDay,
        };
      });
    } else {
      setDateState((prevState) => {
        const schedule = [...prevState.schedule];
        schedule.splice(index, 1);
        return {
          ...prevState,
          schedule: schedule,
        };
      });
    }
  };

  useEffect(() => {
    getSchools();
    getTeachers();
    getSubjects();

    if (id) {
      getScheduleInfo();
    }
  }, []);

  const navigateBack = () => {
    navigate("/schedule");
  };

  const handlecommonInfoChange = (value: string, type: string) => {
    if (type === "school") {
      getClasses(value);
    }
    setCommonInfo((prevState) => {
      return {
        ...prevState,
        [type]: value,
      };
    });
  };

  const handleTimeChange = (index: number, type: string, val: string) => {
    setDateState((prevState) => {
      const updatedSchedule = prevState.schedule.map((item, i) => {
        if (i === index) {
          return {
            ...item,
            [type]: val,
          };
        }
        return item;
      });

      return {
        ...prevState,
        schedule: updatedSchedule,
      };
    });
  };

  const convertForm = (obj: any) => {
    if (viewMode === "day") {
      let object = {
        school_id: obj.school,
        class_id: obj.class_assigned,
        time_slots: Object.entries(obj.time_slots).reduce(
          (acc, [day, daySlots]) => {
            const slotsForDay = daySlots.map((slot) => ({
              day_of_week: day,
              start_time: slot.start_time,
              end_time: slot.end_time,
              teacher: slot.teacher,
              subject: slot.subject,
            }));
            return [...acc, ...slotsForDay];
          },
          [] as {
            day: string;
            type: string;
            start_time: string;
            end_time: string;
          }[]
        ),
      };
      return object;
    } else {
      let object = {
        school_id: obj.school,
        class_id: obj.class_assigned,
        time_slots: obj.time_slots.map((item) => {
          return {
            date: obj.date,
            start_time: item.start_time,
            end_time: item.end_time,
            teacher: item.teacher,
            subject: item.subject,
          };
        }),
      };
      return object;
    }
  };

  const onSubmit = () => {
    setIsLoading(true);
    let url = "";
    if (id) {
      url = `schedule/${id}/`;
    } else {
      url = "schedule/";
    }

    let params = {};

    if (viewMode === "date") {
      params = {
        ...commonInfo,
        ...dateState,
        schedule_type: viewMode,
        time_slots: dateState.schedule,
      };
      delete params.schedule;
    } else {
      params = {
        ...commonInfo,
        schedule_type: "week",
        time_slots: dayState,
      };
    }

    params = convertForm(params);

    Fetch(url, params, { method: id ? "patch" : "post" }).then((res: any) => {
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

  const selectFields = [
    "school",
    "class_assigned",
    "start_time",
    "end_time",
    "teacher",
    "subject",
    "date",
    "class",
  ];

  let params = {
    school: commonInfo.school,
    class: commonInfo.class_assigned,
  };

  console.log();

  const { errors, handleSubmit, handleNewError, removeAllError } = FormC({
    values:
      viewMode === "day"
        ? { ...dayState, ...params }
        : { ...dateState, ...params },
    onSubmit,
    selectFields,
  });

  console.log(
    "err===",
    errors,
    viewMode === "day"
      ? { ...dayState, ...params }
      : { ...dateState, ...params }
  );

  return (
    <Layout>
      <form action="" onSubmit={handleSubmit}>
        <div className={styles.container}>
          <h2>{id ? "Update" : "Create"} Schedule</h2>
          <div className={`${styles.selectContainer} mt-4`}>
            <Select
              label="Select school*"
              options={schools}
              value={commonInfo?.school}
              onChange={(value: string) =>
                handlecommonInfoChange(value, "school")
              }
              error={errors?.school}
            />

            <Select
              label="Select class*"
              options={classes}
              value={commonInfo.class_assigned}
              onChange={(value: string) =>
                handlecommonInfoChange(value, "class_assigned")
              }
              error={errors?.class}
            />
          </div>

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
              Week
            </button>
          </div>

          {viewMode === "day" ? (
            <>
              {Object.entries(dayState).map(([key, value]) => (
                <WeekDay
                  day={key}
                  schedule={value}
                  addItem={() => addItem("day", key as Day)}
                  handleChange={(
                    index: number,
                    type: "start_time" | "end_time" | "subject" | "teacher",
                    value: string
                  ) => handleChange(key as Day, index, type, value)}
                  handleDelete={(index: number) =>
                    handleDelete(index, "day", key as Day)
                  }
                  errors={errors?.[key]}
                  teachers={teachers}
                />
              ))}
            </>
          ) : (
            <DateSchedule
              dateState={dateState}
              handleChange={(value: string, type: string) =>
                setDateState((prevState) => {
                  return {
                    ...prevState,
                    [type]: value,
                  };
                })
              }
              handleTimeChange={(
                index: number,
                type: "start_time" | "end_time" | "subject" | "teacher",
                value: string
              ) => handleTimeChange(index, type, value)}
              teachers={teachers}
              subjects={subjects}
              errors={errors}
              schedule={dateState.schedule}
              addItem={() => addItem("date")}
              handleDelete={(index: number) => handleDelete(index, "date")}
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

export default ScheduleManagement;
