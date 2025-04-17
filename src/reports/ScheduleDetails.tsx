import React, { useEffect, useState } from "react";
import styles from "./ScheduleDetails.module.css";
import Layout from "../../components/common/Layout/Layout";
import Button from "../../components/common/Button/Button";
import { useNavigate } from "react-router-dom";
import Select from "../../components/common/Select/Select";
import Fetch from "../../utils/form-handling/fetch";
import { useToast } from "../../contexts/Toast";
import Modal from "../../components/common/Modal/Modal";
import Loader from "../../components/common/Loader/Loader";
import { DeleteIcon, EditIcon } from "../../assets/svgs";

interface ScheduleListProps {}

const ScheduleList: React.FC<ScheduleListProps> = () => {
  const [data, setData] = useState({
    school: "",
    class: "",
  });
  const [schools, setSchools] = useState([]);
  const [classes, setClasses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [schedule, setSchedule] = useState<any>({});
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [deleteRequestId, setDeleteRequestId] = useState("");

  const toast = useToast();

  const showToast = () => {
    toast.show("Schedule deleted successfully", 2000, "#dc3545");
  };

  const convertResponse = (data: any) => {
    const convertedSchedule: { [key: string]: any[] } = {};
    const dateBasedSchedule: { [key: string]: any[] } = {};

    data.time_slots.forEach((slot: any) => {
      const slotData = {
        start_time: slot.start_time,
        end_time: slot.end_time,
        teacher: slot.teacher?.first_name + " " + slot.teacher?.last_name,
        subject: slot.subject?.name,
      };

      if (slot.day_of_week) {
        const day = slot.day_of_week;
        if (!convertedSchedule[day]) {
          convertedSchedule[day] = [];
        }
        convertedSchedule[day].push(slotData);
      } else if (slot.date) {
        const dateKey = slot.date;
        if (!dateBasedSchedule[dateKey]) {
          dateBasedSchedule[dateKey] = [];
        }
        dateBasedSchedule[dateKey].push(slotData);
      }
    });

    return {
      ...convertedSchedule,
      ...dateBasedSchedule,
    };
  };

  const getSchedule = (classId: string) => {
    setIsTableLoading(true);
    Fetch(`schedule/${classId}/`).then((res: any) => {
      if (res.status) {
        setSchedule(convertResponse(res?.data) || {});
      }
      setIsTableLoading(false);
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

  useEffect(() => {
    getSchools();
  }, []);

  const handleChange = (value: string, type: string) => {
    setSchedule({});
    if (type === "school") {
      getClasses(value);
    }
    if (type === "class") {
      getSchedule(value);
    }
    setData((prevState) => {
      const updatedState = {
        ...prevState,
        [type]: value,
      };

      if (type === "school") {
        updatedState.class = "";
      }

      return updatedState;
    });
  };

  const navigate = useNavigate();

  const handleNavigate = (id: string = "") => {
    navigate(`/schedule/create${id ? `/${id}` : ""}`);
  };

  const handleDelete = () => {
    setIsLoading(true);
    // earlier classId was passed in place of deleteRequestId
    Fetch(`schedule/${deleteRequestId}/`, {}, { method: "delete" }).then(
      (res: any) => {
        if (res.status) {
          setShowModal(false);
          setSchedule({});
          showToast();
        }
        setIsLoading(false);
      }
    );
  };

  return (
    <Layout>
      <div
        style={{
          // height: "calc(100vh - 9rem)",
          backgroundColor: "#f8f9fa",
          padding: "20px",
          marginTop: "20px",
          maxWidth: "calc(100vw - 21rem)",
        }}
      >
        <div className={styles.titleContainer}>
          <h2 className="mb-3">Schedule</h2>
          <Button text="Create" onClick={() => handleNavigate()} />
        </div>

        <div className={`${styles.selectContainer} mt-4`}>
          <Select
            label="Select school*"
            options={schools}
            value={data?.school}
            onChange={(value: string) => handleChange(value, "school")}
          />

          <Select
            label="Select class*"
            options={classes}
            value={data?.class}
            onChange={(value: string) => handleChange(value, "class")}
          />
        </div>
        {!isTableLoading && !data.class && (
          <h5 className="flex-center my-5 ">
            Please select a class to view the timetable
          </h5>
        )}
        {!isTableLoading &&
          Object.keys(schedule).length === 0 &&
          data.class && (
            <h5 className="flex-center my-5">
              No timetable available. Please create one
            </h5>
          )}

        {isTableLoading && (
          <div className="mt-4">
            <Loader text="Loading data..." className="flex-center w-100" />
          </div>
        )}

        {Object.entries(schedule).length > 0 && (
          <table className={styles.scheduleTable}>
            <thead>
              <tr>
                <th>Day</th>
                <th>Teacher</th>
                <th>Subject</th>
                <th>Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(schedule).map(([day, timeSlots]) => (
                <React.Fragment key={day}>
                  {timeSlots.length > 0 ? (
                    timeSlots.map((slot, slotIndex) => (
                      <tr key={slotIndex}>
                        {slotIndex === 0 && (
                          <td
                            rowSpan={timeSlots.length}
                            className={styles.dayCell}
                          >
                            {day}
                          </td>
                        )}
                        <td>{slot.teacher}</td>
                        <td>{slot.subject}</td>
                        <td>{`${slot.start_time} - ${slot.end_time}`}</td>
                        <td>
                          <button
                            style={{
                              border: "none",
                              background: "none",
                              cursor: "pointer",
                            }}
                            className="mr-3"
                            onClick={() => setDeleteRequestId(slot?.id)}
                          >
                            <DeleteIcon size={20} color="#d32f2f" />
                          </button>
                          <button
                            style={{
                              border: "none",
                              background: "none",
                              cursor: "pointer",
                            }}
                            onClick={() => handleNavigate(slot?.id)}
                          >
                            <EditIcon size={20} color="#1976d2" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr key={day}>
                      <td className={styles.dayCell}>{day}</td>
                      <td colSpan={3} className={styles.emptySchedule}>
                        No classes scheduled for this day.
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
        {/* 
        {Object.entries(schedule).length > 0 && (
          <div className={`${styles.buttonContainer} mt-4`}>
            <Button
              text="Edit"
              onClick={handleNavigate}
              style={{ width: "6rem" }}
            />
            <Button
              text="Delete"
              onClick={() => setShowModal(true)}
              type="outline"
              style={{
                width: "6rem",
                borderColor: "#dc3545",
                color: "#dc3545",
              }}
            />
          </div>
        )} */}
      </div>
      <Modal
        title="Confirm!"
        message="Are you sure you want to delete this schedule?"
        onConfirm={handleDelete}
        onCancel={() => setShowModal(false)}
        visible={showModal}
        isLoading={isLoading}
      />
    </Layout>
  );
};

export default ScheduleList;
