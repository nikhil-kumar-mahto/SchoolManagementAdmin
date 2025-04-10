import React, { ChangeEvent, useEffect, useState } from "react";
import Input from "../../components/common/Input/Input";
import Button from "../../components/common/Button/Button";
import styles from "./CreateSchool.module.css";
import Layout from "../../components/common/Layout/Layout";
import ImagePicker from "../../components/common/ImagePicker/ImagePicker";
import { useNavigate, useParams } from "react-router-dom";
import { FormC } from "../../utils/form-handling/validate";
import Fetch from "../../utils/form-handling/fetch";

interface Props {}

const initialState = {
  name: "",
  email: "",
  phone: "",
  address: "",
  logo: null,
  website: "",
};

const CreateSchool: React.FC<Props> = () => {
  const [data, setData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const getSchoolInfo = () => {
    Fetch(`schools/${id}/`).then((res: any) => {
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
      getSchoolInfo();
    }
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogoChange = (file: File | null) => {
    setData((prevData: any) => ({
      ...prevData,
      logo: file,
    }));
  };

  const navigateBack = () => {
    navigate("/schools");
  };

  const onSubmit = () => {
    setIsLoading(true);
    let url = "";
    if (id) {
      url = `schools/${id}/`;
    } else {
      url = "schools/";
    }
    Fetch(url, data, { method: id ? "patch" : "post", inFormData: true }).then(
      (res: any) => {
        if (res.status) {
          navigate("/schools");
        } else {
        }
        setIsLoading(false);
      }
    );
  };

  let params = { ...data, logo: id ? data.logo : data.logo?.name };
  delete params.website;

  const { errors, handleSubmit, handleNewError } = FormC({
    values: params,
    onSubmit,
  });

  console.log("err===", errors);
  console.log("data====", data);

  const getValue = () => {
    if (id) {
      return data.logo;
    } else {
      if (data.logo) {
        return data.logo.name;
      }
    }
    return null;
  };

  return (
    <Layout>
      <form action="" onSubmit={handleSubmit}>
        <div className={styles.container}>
          <h2>{id ? "Update" : "Create"} School</h2>
          <div className={styles.row}>
            <div className={styles.column}>
              <Input
                label="Name"
                name="name"
                value={data.name}
                onChange={handleChange}
                placeholder="Enter teacher's name"
                error={errors?.name}
              />
            </div>
            <div className={styles.column}>
              <Input
                label="Email"
                name="email"
                value={data.email}
                onChange={handleChange}
                placeholder="Enter teacher's email"
                type="email"
                error={errors?.email}
              />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.column}>
              <Input
                label="Phone"
                name="phone"
                value={data.phone}
                onChange={handleChange}
                placeholder="Enter teacher's phone number"
                error={errors?.phone}
              />
            </div>
            <div className={styles.column}>
              <Input
                label="Address"
                name="address"
                value={data.address}
                onChange={handleChange}
                placeholder="Enter teacher's address"
                error={errors?.address}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.column}>
              <ImagePicker
                label="Logo"
                // value={id ? data.logo : data.logo ? data.logo.name : null}
                value={getValue()}
                onChange={handleLogoChange}
                error={errors?.logo}
              />
            </div>
            <div className={styles.column}>
              <Input
                label="Website"
                name="website"
                value={data.website}
                onChange={handleChange}
                placeholder="Enter website's URL"
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
