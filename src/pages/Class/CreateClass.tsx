import React, { ChangeEvent, useEffect, useState } from "react";
import Input from "../../components/common/Input/Input";
import Button from "../../components/common/Button/Button";
import styles from "./CreateClass.module.css";
import Layout from "../../components/common/Layout/Layout";
import { useNavigate, useParams } from "react-router-dom";
import { FormC } from "../../utils/form-handling/validate";
import Fetch from "../../utils/form-handling/fetch";
import { arrayString } from "../../utils/form-handling/arrayString";
import Select from "../../components/common/Select/Select";

interface Props {}

const initialState = {
  name: "",
  section: "",
  school: "",
};

const CreateClass: React.FC<Props> = () => {
  const [data, setData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [schools, setSchools] = useState([]);

  const navigate = useNavigate();

  const getClassInfo = () => {
    Fetch(`classes/${id}/`).then((res: any) => {
      if (res.status) {
        setData(res.data);
      } else {
        // let resErr = arrayString(res);
        // handleNewError(resErr);
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

  const { id } = useParams();

  useEffect(() => {
    getSchools();
    if (id) {
      getClassInfo();
    }
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const navigateBack = () => {
    navigate("/classes");
  };

  const onSubmit = () => {
    setIsLoading(true);
    let url = "";
    if (id) {
      url = `classes/${id}/`;
    } else {
      url = "classes/";
    }
    Fetch(url, data, { method: id ? "patch" : "post" }).then((res: any) => {
      if (res.status) {
        navigate("/classes");
      } else {
        // let resErr = arrayString(res);
        // handleNewError(resErr);
      }
      setIsLoading(false);
    });
  };

  const { errors, handleSubmit, handleNewError } = FormC({
    values: data,
    onSubmit,
  });

  const handleSchoolChange = (value: string) => {
    setData((prevData) => ({
      ...prevData,
      school: value,
    }));
  };

  return (
    <Layout>
      <form action="" onSubmit={handleSubmit}>
        <div className={styles.container}>
          <h2>{id ? "Update" : "Create"} Class</h2>
          <Select
            label="Select school"
            options={schools}
            value={data?.school}
            onChange={handleSchoolChange}
          />
          <div className={styles.row}>
            <div className={styles.column}>
              <Input
                label="Name"
                name="name"
                value={data.name}
                onChange={handleChange}
                placeholder="Enter class name"
                error={errors?.name}
              />
            </div>
            <div className={styles.column}>
              <Input
                label="Section"
                name="section"
                value={data.section}
                onChange={handleChange}
                placeholder="Enter section"
                error={errors?.section}
              />
            </div>
          </div>

          <Button
            text="Cancel"
            type="outline"
            onClick={navigateBack}
            className="mt-2 mr-4"
          />
          <Button
            text={id ? "Update" : "Submit"}
            onClick={handleSubmit}
            className="mt-2"
            isLoading={isLoading}
          />
        </div>
      </form>
    </Layout>
  );
};

export default CreateClass;
