import React, { useEffect, useState } from "react";
import styles from "./ScheduleDetails.module.css";
import dummyScheduleData from "../../static/data";
import Layout from "../../components/common/Layout/Layout";
import Button from "../../components/common/Button/Button";
import { useNavigate } from "react-router-dom";
import Select from "../../components/common/Select/Select";
import Fetch from "../../utils/form-handling/fetch";
import { useToast } from "../../contexts/Toast";
import Modal from "../../components/common/Modal/Modal";

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
  const toast = useToast();

  const showToast = () => {
    toast.show("Schedule deleted successfully", 2000, "#dc3545");
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

  useEffect(() => {
    getSchools();
    getClasses();
  }, []);

  const handleChange = (value: string, type: string) => {
    setData((prevState) => {
      return {
        ...prevState,
        [type]: value,
      };
    });
  };

  const navigate = useNavigate();

  const handleNavigate = (id: string = "") => {
    navigate(`/schedule/create${id ? `/${id}` : ""}`);
  };  

  const handleDelete = () => {
    setIsLoading(true);
    Fetch("schedule/id", {}, { method: "delete" }).then((res: any) => {
      if (res.status) {
        showToast();
      }
      setIsLoading(false);
    });
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
        <div className={styles.schoolClassInfo}></div>
        <table className={styles.scheduleTable}>
          <thead>
            <tr>
              <th>Day</th>
              <th>Time</th>
              <th>Teacher</th>
              <th>Subject</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(dummyScheduleData["day-time-slots"]).map(
              ([day, timeSlots]) => (
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
                        <td>{`${slot.startTime} - ${slot.endTime}`}</td>
                        <td>{slot.teacher}</td>
                        <td>{slot.subject}</td>
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
              )
            )}
          </tbody>
        </table>

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
            style={{ width: "6rem", borderColor: "#dc3545", color: "#dc3545" }}
          />
        </div>
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
