import React, { ChangeEvent, useEffect, useState } from "react";
import Input from "../../components/common/Input/Input";
import Button from "../../components/common/Button/Button";
import styles from "../../styles/Forms.module.css";
import Layout from "../../components/common/Layout/Layout";
import { useNavigate, useParams } from "react-router-dom";
import { FormC } from "../../utils/form-handling/validate";
import Fetch from "../../utils/form-handling/fetch";
import { arrayString } from "../../utils/form-handling/arrayString";
import Select from "../../components/common/Select/Select";
import { useToast } from "../../contexts/Toast";
import { useAppContext } from "../../contexts/AppContext";

interface Props {}

const initialState = {
  name: "",
  section: "",
  school: "",
};

const CreateClass: React.FC<Props> = () => {
  const [data, setData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const { schools } = useAppContext();

  const navigate = useNavigate();
  const toast = useToast();

  const showToast = (message: string) => {
    toast.show(message, 2000, "#4CAF50");
  };

  const getClassInfo = () => {
    Fetch(`classes/${id}/`).then((res: any) => {
      if (res.status) {
        setData({...res.data, school: res?.data?.school?.id});
      }
    });
  };

  const { id } = useParams();

  useEffect(() => {
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
    Fetch(url, data, { method: id ? "put" : "post" }).then((res: any) => {
      if (res.status) {
        showToast(
          id ? "Class updated successfully" : "Class added successfully"
        );
        navigate("/classes");
      } else {
        let resErr = arrayString(res);
        handleNewError(resErr);
      }
      setIsLoading(false);
    });
  };

  const selectFields = ["school"];

  const { errors, handleSubmit, handleNewError } = FormC({
    values: data,
    onSubmit,
    selectFields,
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
            label="Select school*"
            options={schools}
            value={data?.school}
            onChange={handleSchoolChange}
            className="w-25"
            error={errors?.school}
          />
          <div className={styles.row}>
            <div className={styles.column}>
              <Input
                label="Class Name*"
                name="name"
                value={data.name}
                onChange={handleChange}
                placeholder="Enter class name"
                error={errors?.name}
              />
            </div>
            <div className={styles.column}>
              <Input
                label="Section*"
                name="section"
                value={data.section}
                onChange={handleChange}
                placeholder="Enter section"
                error={errors?.section}
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
              buttonType="submit"
            />
          </div>
        </div>
      </form>
    </Layout>
  );
};

export default CreateClass;
