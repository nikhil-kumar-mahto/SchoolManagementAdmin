import React, { useEffect, useState } from "react";
import styles from "./ScheduleManagement.module.css";
import Layout from "../../components/common/Layout/Layout";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
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
  const [dayState, setDayState] = useState<Props>(initialState); // when user selects day
  const [dateState, setDateState] = useState(initialState2); // when user selects date
  const [viewMode, setViewMode] = useState<"date" | "day">("date");
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showEmptyStateModal, setShowEmptyStateModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isValidated, setIsValidated] = useState(false);
  const [parameters, setParamaters] = useState({});
  const [searchParams, setSearchParams] = useSearchParams({});
  const [commonInfo, setCommonInfo] = useState({
    school: searchParams.get("school") || "",
    class_assigned: searchParams.get("class") || "",
  });

  const { id } = useParams();

  const toast = useToast();
  const { schools, subjects } = useAppContext();

  const showToast = (message: string, status: "success" | "danger") => {
    toast.show(message, 2000, status === "success" ? "#4CAF50" : "#dc3545");
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

  const getScheduleInfo = () => {
    Fetch(`schedule/${id}`).then((res: any) => {
      if (res.status) {
        let classes = schools
          .find((item) => item?.value === res?.data?.school)
          ?.classes?.map((item) => ({
            label: item?.name + " " + item?.section,
            value: item?.id,
          }));

        console.log("classes===", classes);

        setClasses(classes || []);
        setCommonInfo({
          school: res?.data?.school,
          class_assigned: res?.data?.sch_class,
        });
        getTeachers(res?.data?.school);
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

  const getTeachers = (id: string) => {
    setTeachers([]);
    Fetch(`list-teachers/?school_id=${id}`).then((res: any) => {
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
          [day]: [...prevState[day], { ...emptyObj }],
        };
      });
    } else {
      setDateState((prevState) => {
        return {
          ...prevState,
          schedule: [...prevState.schedule, { ...emptyObj }],
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
    if (id && schools.length > 0) {
      getScheduleInfo();
    }
    if (searchParams.get("class")) {
      let classes = schools
        .find((item) => item?.value === searchParams.get("school"))
        ?.classes?.map((item) => ({
          label: item?.name + " " + item?.section,
          value: item?.id,
        }));

      setClasses(classes || []);
    }
  }, [schools]);

  const navigateBack = () => {
    navigate("/schedule");
  };

  const handlecommonInfoChange = (value: string, type: string) => {
    if (type === "school") {
      let classes = schools
        .find((item) => item?.value === value)
        ?.classes?.map((item) => ({
          label: item?.name + " " + item?.section,
          value: item?.id,
        }));

      setClasses(classes || []);
      getTeachers(value);
    }
    setCommonInfo((prevState) => {
      return {
        ...prevState,
        [type]: value,
      };
    });

    const updatedParams = {
      school: type === "school" ? value : commonInfo.school,
      class: type === "class" ? value : commonInfo.class_assigned,
    };

    setSearchParams(updatedParams);

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

  const handleCheckValidation = (params) => {
    setIsLoading("button");
    Fetch(
      `schedule/${commonInfo.class_assigned}/validate-slots/`,
      { ...params },
      { method: "post" }
    ).then((res: any) => {
      setIsValidated(true);
      setIsLoading("button");
      if (res.status) {
        handleApiCall(params);
      } else {
        let resErr = arrayString(res);
        handleNewError(resErr);
        setShowModal(true);
      }
      setIsLoading("");
    });
  };

  const handleApiCall = (params: any) => {
    if (id) {
      setIsLoading("button");
    } else {
      setIsLoading("modal");
    }

    let url = "";
    if (id) {
      url = `schedule/${id}/`;
    } else {
      url = "schedule/";
    }
    Fetch(url, { ...params }, { method: id ? "put" : "post" }).then(
      (res: any) => {
        if (res.status) {
          showToast(
            id
              ? "Schedule updated successfully"
              : "Schedule added successfully",
            "success"
          );
          navigate("/schedule");
        } else {
          let resErr = arrayString(res);
          handleNewError(resErr);
        }
        setIsLoading("");
        setShowModal(false);
      }
    );
  };

  const convertForm = (obj: any) => {
    if (viewMode === "day") {
      let object = {
        school: obj.school,
        sch_class: obj.class_assigned,
        time_slots: Object.entries(obj.time_slots).reduce(
          (acc, [day, daySlots]) => {
            let slots = [...daySlots];
            // if (id) {
            //   slots = slots.filter((item) => item.isEdited === true);
            // }
            const slotsForDay = slots.map((slot) => ({
              day_of_week: day,
              start_time: slot.start_time,
              end_time: slot.end_time,
              teacher: slot.teacher,
              subject: slot.subject,
              id: slot.id,
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
      // if (id) {
      //   slots = slots.filter((item) => item?.isEdited === true);
      // }
      let object = {
        school: obj.school,
        sch_class: obj.class_assigned,
        time_slots: slots.map((item) => {
          return {
            date: obj.date,
            start_time: item.start_time,
            end_time: item.end_time,
            teacher: item.teacher,
            subject: item.subject,
            id: item.id,
          };
        }),
      };
      return object;
    }
  };

  const checkDataPresent = () => {
    if (id) {
      // allow empty slots in update mode so that user can delete slots
      return false;
    }
    if (viewMode === "date") {
      if (dateState.schedule.length === 0) {
        return true;
      }
    } else {
      let isEmpty = true;
      Object.entries(dayState).forEach(([key, value]) => {
        if (value.length > 0) {
          isEmpty = false;
        }
      });
      return isEmpty;
    }
  };

  const onSubmit = () => {
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

    setParamaters(params);

    if (!isValidated && !id) {
      handleCheckValidation(params);
    } else {
      handleApiCall(params);
    }
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

  console.log("common info====", commonInfo);

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

  const replicateDay = (replicateTo: string, replicateFrom: string) => {
    setDayState((prevState) => {
      return {
        ...prevState,
        [replicateTo]: prevState[replicateFrom].map((item) => {
          return { ...item, isEdited: id ? true : false };
        }),
      };
    });

    handleWeekTimeSlots({
      ...dayState,
      school: commonInfo.school,
      class: commonInfo.class_assigned,
      [replicateTo]: dayState[replicateFrom].map((item) => {
        return { ...item, isEdited: id ? true : false };
      }),
    });
  };

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

  const deleteItem = () => {
    setIsLoading("delete-modal");
    Fetch(`time-slot/${deleteId}/`, {}, { method: "delete" }).then(
      (res: any) => {
        if (res.status) {
          showToast("Slot deleted successfully", "danger");
          setDeleteId(null);

          if (viewMode === "day") {
            let slotsPresent = 0;
            Object.values(dayState).forEach((item) => {
              if (!!item?.length) {
                slotsPresent++;
              }
            });

            if (slotsPresent === 1) {
              navigate("/schedule");
              return;
            }

            setDayState((prevState) => {
              const updatedDay = { ...prevState };
              Object.entries(updatedDay).forEach(([key, value]) => {
                updatedDay[key] = value.filter((item) => item.id !== deleteId);
              });

              return updatedDay;
            });
          } else {
            if (dateState.schedule.length === 1) {
              navigate("/schedule");
              return;
            }
            setDateState((prevState) => {
              const updatedSchedule = prevState.schedule.filter(
                (item) => item.id !== deleteId
              );
              return { ...prevState, schedule: updatedSchedule };
            });
          }
        }
        setIsLoading("");
      }
    );
  };

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
                  handleDelete={(index: number, id = undefined) => {
                    if (id) {
                      setDeleteId(id);
                    } else {
                      handleDelete(index, "day", key as Day, id);
                    }
                  }}
                  errors={errors?.schedule?.[key]}
                  teachers={teachers}
                  replicateDay={replicateDay}
                  isEditMode={!!id}
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
              handleDelete={(index: number, id = undefined) => {
                if (id) {
                  setDeleteId(id);
                } else {
                  handleDelete(index, "date", "", id);
                }
              }}
              isEditMode={!!id}
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
      {/* <Modal
        title="Confirm!"
        message={errors?.non_field_errors}
        onConfirm={() => setShowModal(false)}
        visible={showModal}
        confirmText="OK"
      /> */}
      <Modal
        title="Confirm!"
        message={
          "Are you sure you want to override your previously added slots?"
        }
        onConfirm={() => handleApiCall(parameters)}
        onCancel={() => setShowModal(false)}
        visible={showModal}
        isLoading={isLoading === "modal"}
      />
      <Modal
        title="Alert!"
        message={"Please ensure at least one slot has been added."}
        onConfirm={() => setShowEmptyStateModal(false)}
        confirmText="OK"
        visible={showEmptyStateModal}
      />
      <Modal
        title="Confirm!"
        message={"Are you sure you want to delete this time slot?"}
        onConfirm={deleteItem}
        onCancel={() => setDeleteId(null)}
        visible={!!deleteId}
        isLoading={isLoading === "delete-modal"}
      />
    </Layout>
  );
};

export default ScheduleManagement;
