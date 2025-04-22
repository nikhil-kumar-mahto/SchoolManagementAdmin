import React, { ChangeEvent, useEffect, useState } from "react";
import Input from "../../components/common/Input/Input";
import Button from "../../components/common/Button/Button";
import styles from "../../styles/Forms.module.css";
import Layout from "../../components/common/Layout/Layout";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../contexts/Toast";
import { FormC } from "../../utils/form-handling/validate";
import Fetch from "../../utils/form-handling/fetch";
import { arrayString } from "../../utils/form-handling/arrayString";
import Select from "../../components/common/Select/Select";
import { onKeyPress } from "../../utils/form-handling/validate";
import {
  getBloodGroups,
  getCategory,
  getGender,
  getMaritalStatus,
  getStatuses,
  mapKeyToLabel,
} from "../../utils/common/utility-functions";
import formStyles from "./Teachers.module.css";
import DatePicker from "../../components/DatePicker/DatePicker";
import ImagePicker from "../../components/common/ImagePicker/ImagePicker";
import { useAppContext } from "../../contexts/AppContext";

interface Props {}

const initialState = {
  email: "",
  phone: "",
  school_id: "",
  branch_id: "",
  teacher_code: "",
  teacher_adt_reg_no: "",
  card_number: "",
  first_name: "",
  last_name: "",
  gender: "",
  emergency_number: "",
  emergency_name: "",
  marital_status: "",
  blood_group: "",
  nominee: "",
  nominee_relation: "",
  location: "",
  location_category: "",
  organizational_classification: "",
  organizational_category: "",
  department_code: "",
  department_head: "",
  immediate_reporting: "",
  teacher_SRA: "",
  category_type: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  permanent_address: "",
  branch: "",
  date_of_birth: "",
  date_joining: "",
  date_of_leaving: "",
  reason: "",
  teacher_cofirm: "",
  date_of_retirement: "",
  department: "",
  designation: "",
  grade: "",
  teacher_adhoc: "",
  adhaar: "",
  pancard: "",
  bank_name: "",
  bank_account_number: "",
  bank_ifsc_code: "",
  teacher_disp: "",
  pension_amount: "",
  voluntary_provident_fund: "",
  universal_account_number: "",
  gov_provident_fund: "",
  gov_provided_fund_number: "",
  file_passbook: "",
  file_adhaar: "",
  file_pancard: "",
  form_11: "",
  academic_qualification: "",
  academic_university: "",
  specialization: "",
  passing_year: "",
  last_school: "",
  last_designation: "",
  last_date_of_leaving: "",
  reference: "",
  family_name1: "",
  relation_name1: "",
  family_age1: "",
  family_adhaar1: "",
  status: "",
  school: "",
};

const CreateTeacher: React.FC<Props> = () => {
  const [data, setData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [isFilesModified, setIsFilesModified] = useState({
    file_passbook: false,
    file_adhaar: false,
    file_pancard: false,
    form_11: false,
  });

  const excludedKeys: string[] = ["school_id", "id", "school", "user"];

  const { id } = useParams();
  const { schools } = useAppContext();

  const navigate = useNavigate();
  const toast = useToast();

  const showToast = (message: string) => {
    toast.show(message, 2000, "#4CAF50");
  };

  const getTeacherInfo = () => {
    Fetch(`teachers/${id}/`).then((res: any) => {
      if (res.status) {
        setData({ ...res.data, school_id: res?.data?.school });
      }
    });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const navigateBack = () => {
    navigate("/teachers");
  };

  const onSubmit = () => {
    setIsLoading(true);
    let url = "";
    if (id) {
      url = `teachers/${id}/`;
    } else {
      url = "teachers/";
    }

    let params = { ...data };

    // dont include these fields if they have not been changed in edit mode
    if (id) {
      const fieldsToDelete = [
        "file_adhaar",
        "file_pancard",
        "file_passbook",
        "form_11",
      ];

      fieldsToDelete.forEach((key) => {
        if (!isFilesModified[key]) {
          delete params[key];
        }
      });
    }

    delete params.school_id;

    Fetch(url, id ? { ...params, school: data?.school.id } : params, {
      method: id ? "put" : "post",
      inFormData: true,
    }).then((res: any) => {
      if (res.status) {
        showToast(
          id ? "Teacher updated successfully" : "Teacher added successfully"
        );
        navigate("/teachers");
      } else {
        let resErr = arrayString(res);
        handleNewError(resErr);
      }
      setIsLoading(false);
    });
  };

  let params = {
    ...data,
    file_passbook:
      id && !isFilesModified.file_passbook
        ? data.file_passbook
        : data.file_passbook?.name,
    file_adhaar:
      id && !isFilesModified.file_adhaar
        ? data.file_adhaar
        : data.file_adhaar?.name,
    file_pancard:
      id && !isFilesModified.file_pancard
        ? data.file_pancard
        : data.file_pancard?.name,
    form_11: id && !isFilesModified.form_11 ? data.form_11 : data.form_11?.name,
  };

  delete params.school_id;

  const { errors, handleSubmit, handleNewError } = FormC({
    values: {
      ...params,
    },
    onSubmit,
  });

  const handleSelectChange = (value: string, type: string) => {
    setData((prevData) => ({
      ...prevData,
      [type]: value,
    }));
  };

  useEffect(() => {
    if (id) {
      getTeacherInfo();
    }
  }, []);

  const getMaxLength = (type: string) => {
    switch (type) {
      case "phone":
        return 12;
      case "family_age1":
        return 3;
      default:
        return undefined;
    }
  };

  const getValue = (key: string) => {
    if (id) {
      return data?.[key];
    } else {
      if (data?.[key]) {
        return data?.[key]?.name;
      }
    }
    return null;
  };

  const handleFileChange = (file: File | null, key: string) => {
    if (id) {
      setIsFilesModified((prevState) => {
        return {
          ...prevState,
          [key]: true,
        };
      });
    }
    setData((prevData: any) => ({
      ...prevData,
      [key]: file,
    }));
  };

  return (
    <Layout>
      <form action="" onSubmit={handleSubmit}>
        <div className={styles.container}>
          <h2>{id ? "Update" : "Create"} Teacher</h2>
          <Select
            label="Select school*"
            options={schools}
            value={data?.school}
            onChange={(value) => handleSelectChange(value, "school")}
            error={errors?.school && "Please select school."}
            className="w-25"
          />

          <div className={formStyles["form-grid"]}>
            {Object.keys(data)
              .filter((key) => !excludedKeys.includes(key))
              .map((key) => {
                if (key === "gender") {
                  return (
                    <Select
                      key={key}
                      label="Select gender*"
                      options={getGender()}
                      value={data?.gender}
                      onChange={(value) => handleSelectChange(value, "gender")}
                      error={errors?.gender && "Please select gender."}
                    />
                  );
                } else if (key === "marital_status") {
                  return (
                    <Select
                      key={key}
                      label="Select marital status*"
                      options={getMaritalStatus()}
                      value={data?.marital_status}
                      onChange={(value) =>
                        handleSelectChange(value, "marital_status")
                      }
                      error={
                        errors?.marital_status &&
                        "Please select marital status."
                      }
                    />
                  );
                } else if (key === "blood_group") {
                  return (
                    <Select
                      key={key}
                      label="Select blood group*"
                      options={getBloodGroups()}
                      value={data?.blood_group}
                      onChange={(value) =>
                        handleSelectChange(value, "blood_group")
                      }
                      error={
                        errors?.blood_group && "Please select blood group."
                      }
                    />
                  );
                } else if (key === "category_type") {
                  return (
                    <Select
                      key={key}
                      label="Select category*"
                      options={getCategory()}
                      value={data?.category_type}
                      onChange={(value) =>
                        handleSelectChange(value, "category_type")
                      }
                      error={errors?.category_type && "Please select category."}
                    />
                  );
                } else if (key === "status") {
                  return (
                    <Select
                      key={key}
                      label="Select status*"
                      options={getStatuses()}
                      value={data?.status}
                      onChange={(value) => handleSelectChange(value, "status")}
                      error={errors?.status && "Please select status."}
                    />
                  );
                } else if (
                  key === "date_of_birth" ||
                  key === "date_joining" ||
                  key === "date_of_leaving" ||
                  key === "date_of_retirement" ||
                  key === "last_date_of_leaving"
                ) {
                  return (
                    <DatePicker
                      label={`${mapKeyToLabel(key)}*`}
                      selectedDate={data[key]}
                      onDateChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleSelectChange(e.target.value, key)
                      }
                      error={
                        errors[key] &&
                        `Please select ${mapKeyToLabel(
                          key
                        ).toLocaleLowerCase()}.`
                      }
                      className="w-100"
                    />
                  );
                } else if (
                  key === "file_passbook" ||
                  key === "file_adhaar" ||
                  key === "file_pancard" ||
                  key === "form_11"
                ) {
                  return (
                    <ImagePicker
                      key={key}
                      componentKey={key}
                      label={`${mapKeyToLabel(key)}*`}
                      value={getValue(key)}
                      onChange={(file: File | null) => {
                        handleFileChange(file, key);
                      }}
                      error={
                        errors?.[key] && `Please upload ${mapKeyToLabel(key)}`
                      }
                    />
                  );
                }
                return (
                  <div className={formStyles["form-column"]} key={key}>
                    <Input
                      label={`${mapKeyToLabel(key)}*`}
                      name={key}
                      defaultValue={data[key]}
                      onBlur={handleChange}
                      placeholder={`Enter ${mapKeyToLabel(key).toLowerCase()}`}
                      error={
                        errors[key] &&
                        `Please enter ${mapKeyToLabel(
                          key
                        ).toLocaleLowerCase()}.`
                      }
                      onKeyPress={
                        key === "phone" ||
                        key === "card_number" ||
                        key === "emergency_number" ||
                        key === "adhaar" ||
                        key === "pension_amount" ||
                        key === "passing_year" ||
                        key === "gov_provident_fund" ||
                        key === "family_age1" ||
                        key === "family_adhaar1"
                          ? onKeyPress
                          : () => {}
                      }
                      maxLength={getMaxLength(key)}
                    />
                  </div>
                );
              })}
          </div>

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

export default CreateTeacher;
