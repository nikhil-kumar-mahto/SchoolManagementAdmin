import React, { ChangeEvent, useEffect, useState } from "react";
import Input from "../../components/common/Input/Input";
import Button from "../../components/common/Button/Button";
import styles from "../../styles/Forms.module.css";
import Layout from "../../components/common/Layout/Layout";
import ImagePicker from "../../components/common/ImagePicker/ImagePicker";
import { useNavigate, useParams } from "react-router-dom";
import { FormC } from "../../utils/form-handling/validate";
import { onKeyPress } from "../../utils/form-handling/validate";
import Fetch from "../../utils/form-handling/fetch";
import { arrayString } from "../../utils/form-handling/arrayString";
import { useToast } from "../../contexts/Toast";
import { useAppContext } from "../../contexts/AppContext";

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
  let tabIndex = 1;
  const [data, setData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [isLogoChanged, setIsLogoChanged] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const { getSchools } = useAppContext();

  const showToast = (message: string) => {
    toast.show(message, 2000, "#4CAF50");
  };

  const getSchoolInfo = () => {
    Fetch(`schools/${id}/`).then((res: any) => {
      if (res.status) {
        setData(res.data);
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
    if (id) {
      setIsLogoChanged(true);
    }
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
    let params = { ...data };
    if (!isLogoChanged && id) {
      delete params.logo;
    }
    Fetch(url, params, {
      method: id ? "put" : "post",
      inFormData: true,
    }).then((res: any) => {
      if (res.status) {
        showToast(
          id ? "School updated successfully" : "School added successfully"
        );
        navigate("/schools");
        getSchools();
      } else {
        let resErr = arrayString(res);
        handleNewError(resErr);
      }
      setIsLoading(false);
    });
  };

  let params = {
    ...data,
    logo: id && !isLogoChanged ? data.logo : data.logo?.name,
  };
  // if (!params.website) {
  //   delete params.website;
  // }
  delete params.website;
  delete params.classes; // not taken on state, but is received from backend API during edit mode

  const { errors, handleSubmit, handleNewError } = FormC({
    values: params,
    onSubmit,
  });

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
                label="Name*"
                name="name"
                value={data.name}
                onChange={handleChange}
                placeholder="Enter school's name"
                error={errors?.name}
                tabIndex={tabIndex++}
              />
            </div>
            <div className={styles.column}>
              <Input
                label="Email*"
                name="email"
                value={data.email}
                onChange={handleChange}
                placeholder="Enter school's email"
                type="email"
                error={errors?.email}
                tabIndex={tabIndex++}
              />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.column}>
              <Input
                label="Phone*"
                name="phone"
                value={data.phone}
                onChange={handleChange}
                placeholder="Enter school's phone number"
                error={errors?.phone}
                onKeyPress={onKeyPress}
                maxLength={12}
                tabIndex={tabIndex++}
              />
            </div>
            <div className={styles.column}>
              <Input
                label="Address*"
                name="address"
                value={data.address}
                onChange={handleChange}
                placeholder="Enter school's address"
                error={errors?.address}
                tabIndex={tabIndex++}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.column}>
              <ImagePicker
                label="Logo*"
                value={getValue()}
                onChange={handleLogoChange}
                error={errors?.logo}
                componentKey="logo"
                tabIndex={tabIndex++}
              />
            </div>
            <div className={styles.column}>
              <Input
                label="Website"
                name="website"
                value={data.website}
                onChange={handleChange}
                placeholder="Enter website's URL"
                tabIndex={tabIndex++}
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

export default CreateSchool;
