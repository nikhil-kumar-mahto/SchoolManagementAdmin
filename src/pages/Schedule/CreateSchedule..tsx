import React, { useEffect, useState } from "react";
import Button from "../../components/common/Button/Button";
import styles from "../../styles/Forms.module.css";
import Layout from "../../components/common/Layout/Layout";
import { useNavigate, useParams } from "react-router-dom";
import { FormC } from "../../utils/form-handling/validate";
import Fetch from "../../utils/form-handling/fetch";
import { arrayString } from "../../utils/form-handling/arrayString";
import Select from "../../components/common/Select/Select";
import {
  filterTimeArray,
  generateTimeArray,
} from "../../utils/common/utility-functions";
import { useToast } from "../../contexts/Toast";

interface Props {}

const initialState = {
  school: "",
  class_assigned: "",
  subject: "",
  teacher: "",
  start_time: "",
  end_time: "",
  day: "",
};

const CreateSchedule: React.FC<Props> = () => {
  const [data, setData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [schools, setSchools] = useState([]);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const toast = useToast();

  const showToast = (message: string) => {
    toast.show(message, 2000, "#4CAF50");
  };

  const navigate = useNavigate();

  const getScheduleInfo = () => {
    Fetch(`schedule/${id}/`).then((res: any) => {
      if (res.status) {
        setData(res.data);
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

  const { id } = useParams();

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

  let params = { ...data };
  delete params.teacher;

  const { errors, handleSubmit, handleNewError } = FormC({
    values: params,
    onSubmit,
  });

  const handleSchoolChange = (value: string, type: string) => {
    setData((prevData) => ({
      ...prevData,
      [type]: value,
      ...(type === "start_time" && { end_time: "" }),
    }));
  };

  return (
    <Layout>
      <form action="" onSubmit={handleSubmit}>
        <div className={styles.container}>
          <h2>{id ? "Update" : "Create"} Schedule</h2>

          <div>
            <div className={`${styles.row} ${styles.selectContainer}`}>
              <Select
                label="Select school"
                options={schools}
                value={data?.school}
                onChange={(value: string) =>
                  handleSchoolChange(value, "school")
                }
                error={errors?.school}
              />

              <Select
                label="Select class"
                options={classes}
                value={data?.class_assigned}
                onChange={(value: string) =>
                  handleSchoolChange(value, "class_assigned")
                }
                error={errors?.class_assigned}
              />

              <Select
                label="Select teacher"
                options={teachers}
                value={data?.teacher}
                onChange={(value: string) =>
                  handleSchoolChange(value, "teacher")
                }
                error={errors?.teacher}
              />

              <Select
                label="Select subject"
                options={subjects}
                value={data?.subject}
                onChange={(value: string) =>
                  handleSchoolChange(value, "subject")
                }
                error={errors?.subject}
              />
            </div>

            <div className={`${styles.row} ${styles.selectContainer}`}>
              <Select
                label="Select start time"
                options={generateTimeArray()}
                value={data?.start_time}
                onChange={(value: string) =>
                  handleSchoolChange(value, "start_time")
                }
                error={errors?.start_time}
              />
              <Select
                label="Select end time"
                options={filterTimeArray(data?.start_time)}
                value={data?.end_time}
                onChange={(value: string) =>
                  handleSchoolChange(value, "end_time")
                }
                error={errors?.end_time}
              />
            </div>
          </div>

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

export default CreateSchedule;
