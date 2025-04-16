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

type Day =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

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
  Saturday: [emptyObj],
  Sunday: [emptyObj],
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
  const [deletedTimeSlots, setDeletedTimeSlots] = useState([]);

  const { id } = useParams();

  const toast = useToast();

  const showToast = (message: string) => {
    toast.show(message, 2000, "#4CAF50");
  };

  const navigate = useNavigate();

  const convertToDayState = (data: any[]) => {
    const result: Record<string, (typeof emptyObj)[]> = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: [],
    };

    data.forEach((entry) => {
      const day = entry.day_of_week;
      if (result[day]) {
        result[day].push({
          start_time: entry.start_time || "",
          end_time: entry.end_time || "",
          teacher: entry.teacher?.id || "",
          subject: entry.subject?.id || "",
          id: entry?.id,
        });
      }
    });

    // for (const day in result) {
    //   if (result[day].length === 0) {
    //     result[day].push({ ...emptyObj });
    //   }
    // }

    Object.keys(result).forEach((day) => {
      if (result[day].length === 0) {
        delete result[day];
      }
    });

    return result;
  };

  const convertToDateState = (data: any[]) => {
    let convertedFormat = {};
    convertedFormat.date = data?.time_slots?.[0]?.date;
    convertedFormat.schedule = data?.time_slots?.map((item) => {
      return {
        start_time: item?.start_time,
        end_time: item?.end_time,
        teacher: item?.teacher?.id,
        subject: item?.subject?.id,
        id: item?.id,
      };
    });

    return convertedFormat;
  };

  const getScheduleInfo = () => {
    Fetch(`schedule/${id}/`).then((res: any) => {
      if (res.status) {
        getClasses(res?.data?.school?.id);
        setCommonInfo({
          school: res?.data?.school?.id,
          class_assigned: res?.data?.id,
        });
        if (res?.data?.time_slots[0]?.day_of_week) {
          // set state for week
          setViewMode("day");
          let convertedFormat = convertToDayState(res?.data?.time_slots);
          setDayState(convertedFormat as any);
        } else {
          // set state for date
          setDateState(convertToDateState(res?.data) as any);
        }
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
          [day]: [
            ...prevState[day],
            { ...emptyObj, isEdited: id ? true : false }, // isEdited is added to keep track of all those items that have been added during update mode
          ],
        };
      });
    } else {
      setDateState((prevState) => {
        return {
          ...prevState,
          schedule: [
            ...prevState.schedule,
            { ...emptyObj, isEdited: id ? true : false }, // isEdited is added to keep track of all those items that have been added during update mode
          ],
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
    day: Day = "Monday",
    deletedId = undefined
  ) => {
    if (id && deletedId) {
      setDeletedTimeSlots((prevState) => {
        return [...prevState, deletedId];
      });
    }
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

  // const convertForm = (obj: any) => {
  //   if (viewMode === "day") {
  //     let object = {
  //       school_id: obj.school,
  //       class_id: obj.class_assigned,
  //       time_slots: Object.entries(obj.time_slots).reduce(
  //         (acc, [day, daySlots]) => {
  //           const slotsForDay = daySlots.map((slot) => ({
  //             day_of_week: day,
  //             start_time: slot.start_time,
  //             end_time: slot.end_time,
  //             teacher: slot.teacher,
  //             subject: slot.subject,
  //           }));
  //           return [...acc, ...slotsForDay];
  //         },
  //         [] as {
  //           day: string;
  //           type: string;
  //           start_time: string;
  //           end_time: string;
  //         }[]
  //       ),
  //     };
  //     return object;
  //   } else {
  //     let object = {
  //       school_id: obj.school,
  //       class_id: obj.class_assigned,
  //       time_slots: obj.time_slots.map((item) => {
  //         return {
  //           date: obj.date,
  //           start_time: item.start_time,
  //           end_time: item.end_time,
  //           teacher: item.teacher,
  //           subject: item.subject,
  //         };
  //       }),
  //     };
  //     return object;
  //   }
  // };

  const convertForm = (obj: any) => {
    if (viewMode === "day") {
      let object = {
        school_id: obj.school,
        class_id: obj.class_assigned,
        time_slots: Object.entries(obj.time_slots).reduce(
          (acc, [day, daySlots]) => {
            let slots = [...daySlots];
            if (id) {
              slots = slots.filter((item) => item.isEdited === true);
            }
            const slotsForDay = slots.map((slot) => ({
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
      let slots = [...obj?.time_slots];
      if (id) {
        slots = slots.filter((item) => item?.isEdited === true);
      }
      let object = {
        school_id: obj.school,
        class_id: obj.class_assigned,
        time_slots: slots.map((item) => {
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

    if (id) {
      params = {
        school_id: params?.school_id,
        deleted_time_slots: deletedTimeSlots,
        time_slots: params?.time_slots,
      };
    }

    Fetch(url, params, { method: id ? "put" : "post" }).then((res: any) => {
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

  let dayParams = { ...dayState };
  [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ].forEach((day) => {
    if (Array.isArray(dayParams[day]) && dayParams[day].length === 0) {
      delete dayParams[day];
    }
  });

  const { errors, handleSubmit, handleNewError, removeAllError } = FormC({
    values:
      viewMode === "day"
        ? { ...dayParams, ...params }
        : { ...dateState, ...params },
    onSubmit,
    selectFields,
  });

  console.log("errors====", errors);

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
                  handleDelete={(index: number, id = undefined) =>
                    handleDelete(index, "day", key as Day, id)
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
              handleDelete={(index: number, id = undefined) =>
                handleDelete(index, "date", id)
              }
            />
          )}

          {errors?.non_field_errors && (
            <p className="error">{errors?.non_field_errors}</p>
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
