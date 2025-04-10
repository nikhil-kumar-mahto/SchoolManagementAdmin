import React, { ChangeEvent, useEffect, useState } from "react";
import Input from "../../components/common/Input/Input";
import Button from "../../components/common/Button/Button";
import styles from "./CreateSubjects.module.css";
import Layout from "../../components/common/Layout/Layout";
import { useNavigate, useParams } from "react-router-dom";
import { FormC } from "../../utils/form-handling/validate";
import Fetch from "../../utils/form-handling/fetch";
import { arrayString } from "../../utils/form-handling/arrayString";

interface Props {}

const initialState = {
  name: "",
};

const CreateSchool: React.FC<Props> = () => {
  const [data, setData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const getSubjectInfo = () => {
    Fetch(`subjects/${id}/`).then((res: any) => {
      if (res.status) {
        setData(res.data);
      } else {
        // let resErr = arrayString(res);
        // handleNewError(resErr);
      }
    });
  };

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      getSubjectInfo();
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
    navigate("/subjects");
  };

  const onSubmit = () => {
    setIsLoading(true);
    let url = "";
    if (id) {
      url = `subjects/${id}/`;
    } else {
      url = "subjects/";
    }
    Fetch(url, data, { method: id ? "patch" : "post" }).then((res: any) => {
      if (res.status) {
        navigate("/subjects");
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

  return (
    <Layout>
      <form action="" onSubmit={handleSubmit}>
        <div className={styles.container}>
          <h2>{id ? "Update" : "Create"} Subject</h2>
          <div className={styles.row}>
            <div className={styles.column}>
              <Input
                label="Name"
                name="name"
                value={data.name}
                onChange={handleChange}
                placeholder="Enter subject's name"
                error={errors?.name}
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

export default CreateSchool;
