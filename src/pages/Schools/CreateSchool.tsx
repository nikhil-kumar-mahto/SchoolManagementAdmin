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
import { IconEye, IconViewOff } from "../../assets/svgs";

interface Props {}

const initialState = {
  name: "",
  email: "",
  phone_number: "",
  address: "",
  logo: null,
  website: "",
  phone_number_prefix: "+91",
  password: "",
  confirm_password: "",
};

const CreateSchool: React.FC<Props> = () => {
  let tabIndex = 1;
  const [data, setData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [isLogoChanged, setIsLogoChanged] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const [passwordVisible, setPasswordVisible] = useState({
    password: false,
    confirm_password: false,
  });

  const { getSchools } = useAppContext();

  const showToast = (message: string) => {
    toast.show(message, 2000, "#4CAF50");
  };

  const getSchoolInfo = () => {
    Fetch(`schools/${id}/`).then((res: any) => {
      if (res.status) {
        setData({ ...initialState, ...res?.data });
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

  console.log("data=====", data);

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
    console.log("params===", params);

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
  if (!params.website) {
    delete params.website;
  }
  delete params.classes; // not taken on state, but is received from backend API during edit mode
  delete params.phone_number_prefix;

  if (id) {
    delete params.password;
    delete params.confirm_password;
  }

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
                placeholder="Enter school name"
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
                placeholder="Enter school email"
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
                name="phone_number"
                value={data.phone_number}
                onChange={handleChange}
                placeholder="Enter school phone number"
                error={errors?.phone_number}
                onKeyPress={onKeyPress}
                maxLength={10}
                tabIndex={tabIndex++}
              />
            </div>
            <div className={styles.column}>
              <Input
                label="Address*"
                name="address"
                value={data.address}
                onChange={handleChange}
                placeholder="Enter school address"
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
                showPreview={true}
              />
            </div>
            <div className={styles.column}>
              <Input
                label="Website"
                name="website"
                value={data.website}
                onChange={handleChange}
                placeholder="Enter website URL"
                tabIndex={tabIndex++}
                error={errors?.website}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.column}>
              <Input
                label="Password"
                name="password"
                value={data?.password}
                onChange={handleChange}
                placeholder="Enter password"
                tabIndex={tabIndex++}
                error={errors?.password}
                iconRight={
                  !passwordVisible.password ? <IconEye /> : <IconViewOff />
                }
                handleIconButtonClick={() =>
                  setPasswordVisible((prevState) => ({
                    ...prevState,
                    password: !prevState.password,
                  }))
                }
                type={!passwordVisible.password ? "password" : "text"}
                autoComplete="new-password"
              />
            </div>
            <div className={styles.column}>
              <Input
                label="Confirm Password"
                name="confirm_password"
                value={data?.confirm_password}
                onChange={handleChange}
                placeholder="Confirm password"
                tabIndex={tabIndex++}
                error={errors?.confirm_password}
                iconRight={
                  !passwordVisible.confirm_password ? (
                    <IconEye />
                  ) : (
                    <IconViewOff />
                  )
                }
                handleIconButtonClick={() =>
                  setPasswordVisible((prevState) => ({
                    ...prevState,
                    confirm_password: !prevState.confirm_password,
                  }))
                }
                type={!passwordVisible.confirm_password ? "password" : "text"}
                autoComplete="new-password"
              />
            </div>
          </div>

          {errors?.non_field_errors && (
            <p className="error">{errors?.non_field_errors}</p>
          )}

          {errors?.unauthorized && (
            <p className="error">{errors?.unauthorized}</p>
          )}

          {errors?.internalServerError && (
            <p className="error">{errors?.internalServerError}</p>
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

export default CreateSchool;
