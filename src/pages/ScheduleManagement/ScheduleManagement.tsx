import React, { useEffect, useState } from "react";
import styles from "./ScheduleManagement.module.css";
import Layout from "../../components/common/Layout/Layout";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import WeekDay from "../../components/CreateSchedule/WeeklyCalendar/WeekDay";
import DateSchedule from "../../components/CreateSchedule/DateSchedule/DateSchedule";
import Fetch from "../../utils/form-handling/fetch";
import { FormC } from "../../utils/form-handling/validate";
import { arrayString } from "../../utils/form-handling/arrayString";
import Select from "../../components/common/Select/Select";
import { useToast } from "../../contexts/Toast";
import Button from "../../components/common/Button/Button";
import { useAppContext } from "../../contexts/AppContext";
import Modal from "../../components/common/Modal/Modal";

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
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState("");
  const [deletedTimeSlots, setDeletedTimeSlots] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");

  const { id } = useParams();

  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const day_of_week = searchParams.get("day_of_week");
  const date = searchParams.get("date");

  const toast = useToast();
  const { schools, subjects } = useAppContext();

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

  console.log("router===", day_of_week, !!day_of_week);

  const getScheduleInfo = () => {
    Fetch(
      `schedule/${id}?${day_of_week ? "day_of_week" : "date"}=${
        day_of_week ? day_of_week : date
      }`
    ).then((res: any) => {
      if (res.status) {
        // getClasses(res?.data?.school?.id);
        let classes = schools
          .find((item) => item?.value === res?.data?.school)
          ?.classes?.map((item) => ({ label: item?.name, value: item?.id }));

        console.log("schools===", schools);

        setClasses(classes || []);
        setCommonInfo({
          school: res?.data?.school,
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

  console.log("class assifned===", commonInfo.class_assigned);

  console.log("classes===", classes);

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
    value: string,
    deletedId = undefined
  ) => {
    if (id && deletedId) {
      setDeletedTimeSlots((prevState) => {
        return [...prevState, deletedId];
      });
    }
    // setDayState((prevState) => {
    //   const updatedDay = [...prevState[day]];
    //   const updatedTime = { ...updatedDay[index], isEdited: id ? true : false };

    //   updatedTime[type] = value;
    //   updatedDay[index] = updatedTime;

    //   return {
    //     ...prevState,
    //     [day]: updatedDay,
    //   };
    // });

    const updatedDay = [...dayState[day]];
    const updatedTime = { ...updatedDay[index], isEdited: id ? true : false };

    updatedTime[type] = value;
    updatedDay[index] = updatedTime;

    const newState = {
      ...dayState,
      [day]: updatedDay,
    };

    setDayState(newState);

    handleWeekTimeSlots({
      ...newState,
      school: commonInfo.school,
      class: commonInfo.class_assigned,
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
    getTeachers();
    if (id && schools.length > 0) {
      getScheduleInfo();
    }
  }, [schools]);

  const navigateBack = () => {
    navigate("/schedule");
  };

  const handlecommonInfoChange = (value: string, type: string) => {
    if (type === "school") {
      // getClasses(value);
      let classes = schools
        .find((item) => item?.value === value)
        ?.classes?.map((item) => ({ label: item?.name, value: item?.id }));

      setClasses(classes || []);
    }
    setCommonInfo((prevState) => {
      return {
        ...prevState,
        [type]: value,
      };
    });

    const key = type === "class_assigned" ? "class" : type;

    if (viewMode === "date") {
      handleDateTimeSlots({ ...dateState, ...commonInfo, [key]: value });
    } else {
      handleWeekTimeSlots({ ...dayState, ...commonInfo, [key]: value });
    }
  };

  const handleTimeChange = (
    index: number,
    type: string,
    val: string,
    deletedId = undefined
  ) => {
    if (id && deletedId) {
      setDeletedTimeSlots((prevState) => {
        return [...prevState, deletedId];
      });
    }
    const updatedSchedule = dateState.schedule.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          [type]: val,
          isEdited: id ? true : false,
        };
      }
      return item;
    });
    let updatedState = {
      ...dateState,
      schedule: updatedSchedule,
    };
    setDateState(updatedState);
    handleDateTimeSlots({
      ...updatedState,
      school: commonInfo.school,
      class: commonInfo.class_assigned,
    });
  };

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
    // if (Object.keys(errors).length > 0) {
    //   return;
    // }
    if (showModal) {
      setIsLoading("modal");
    } else {
      setIsLoading("button");
    }
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
        school_id: params?.school_id?.id,
        deleted_time_slots: deletedTimeSlots,
        time_slots: params?.time_slots,
      };
    }

    Fetch(
      url,
      { ...params, is_override: showModal },
      { method: id ? "put" : "post" }
    ).then((res: any) => {
      setIsLoading("");
      if (res.status) {
        showToast(
          id ? "Schedule updated successfully" : "Schedule added successfully"
        );
        navigate("/schedule");
      } else {
        let resErr = arrayString(res);
        handleNewError(resErr);
        if (resErr?.non_field_errors) {
          setMessage(resErr?.non_field_errors);
          setShowModal(true);
          return;
        }
      }
      // setIsLoading("");
      setShowModal(false);
    });
  };

  const changeViewMode = (type: "date" | "day") => {
    if (id) {
      return;
    }
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

  const {
    errors,
    handleSubmit,
    handleNewError,
    removeAllError,
    handleDateTimeSlots,
    handleWeekTimeSlots,
  } = FormC({
    values:
      viewMode === "day"
        ? { ...dayParams, ...params }
        : { ...dateState, ...params },
    onSubmit,
    selectFields,
  });

  console.log("err===", errors);

  return (
    <Layout>
      <form
        action=""
        onSubmit={() => {
          if (viewMode === "date") {
            handleDateTimeSlots(
              {
                ...dateState,
                school: commonInfo.school,
                class: commonInfo.class_assigned,
              },
              true
            );
          } else {
            handleWeekTimeSlots({
              ...dayState,
              school: commonInfo.school,
              class: commonInfo.class_assigned,
            });
          }
        }}
      >
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
              disabled={id ? true : false}
            />

            <Select
              label="Select class*"
              options={classes}
              value={commonInfo.class_assigned}
              onChange={(value: string) =>
                handlecommonInfoChange(value, "class_assigned")
              }
              error={errors?.class}
              disabled={id ? true : false}
            />
          </div>

          <div className={`${styles.viewToggle} mt-3`}>
            <button
              disabled={id ? true : false}
              type="button"
              className={`${styles.toggleButton} ${
                viewMode === "date" ? styles.active : ""
              }`}
              onClick={() => changeViewMode("date")}
            >
              Date
            </button>
            <button
              disabled={id ? true : false}
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
                  key={key}
                  day={key}
                  schedule={value}
                  addItem={() => addItem("day", key as Day)}
                  handleChange={(
                    index: number,
                    type: "start_time" | "end_time" | "subject" | "teacher",
                    value: string,
                    id = undefined
                  ) => handleChange(key as Day, index, type, value, id)}
                  handleDelete={(index: number, id = undefined) =>
                    handleDelete(index, "day", key as Day, id)
                  }
                  // errors={errors?.[key]}
                  errors={errors?.schedule?.[key]}
                  teachers={teachers}
                />
              ))}
            </>
          ) : (
            <DateSchedule
              dateState={dateState}
              handleChange={(value: string, type: string) => {
                setDateState((prevState) => {
                  return {
                    ...prevState,
                    [type]: value,
                  };
                });
                handleDateTimeSlots({
                  ...commonInfo,
                  ...dateState,
                  [type]: value,
                });
              }}
              handleTimeChange={(
                index: number,
                type: "start_time" | "end_time" | "subject" | "teacher",
                value: string,
                id = undefined
              ) => handleTimeChange(index, type, value, id)}
              teachers={teachers}
              subjects={subjects}
              errors={errors}
              schedule={dateState.schedule}
              addItem={() => addItem("date")}
              handleDelete={(index: number, id = undefined) =>
                handleDelete(index, "date", "", id)
              }
              isEditMode={!!id}
            />
          )}

          {/* {errors?.non_field_errors && (
            <p className="error">{errors?.non_field_errors}</p>
          )} */}

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
              onClick={() => {
                if (viewMode === "date") {
                  handleDateTimeSlots(
                    {
                      ...dateState,
                      school: commonInfo.school,
                      class: commonInfo.class_assigned,
                    },
                    true
                  );
                } else {
                  handleWeekTimeSlots(
                    {
                      ...dayState,
                      school: commonInfo.school,
                      class: commonInfo.class_assigned,
                    },
                    true
                  );
                }
              }}
              className="mt-2"
              isLoading={isLoading === "button"}
              style={{ width: "8rem" }}
            />
          </div>
        </div>
      </form>
      <Modal
        title="Confirm!"
        message={errors?.non_field_errors}
        onConfirm={() => setShowModal(false)}
        visible={showModal}
        confirmText="OK"
      />
      <Modal
        title="Confirm!"
        message={message}
        onConfirm={handleSubmit}
        onCancel={() => setShowModal(false)}
        visible={showModal}
        isLoading={isLoading === "modal"}
      />
    </Layout>
  );
};

export default ScheduleManagement;
