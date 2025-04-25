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
import moment from "moment";
import { IconEye, IconViewOff } from "../../assets/svgs";

interface Props {}

const mandatoryFields = [
  "email",
  "phone",
  "teacher_code",
  "first_name",
  "last_name",
  "gender",
  "department_code",
];

const initialState = {
  // mandatory mandatory fields
  email: "",
  phone: "",
  teacher_code: "",
  first_name: "",
  last_name: "",
  gender: "",
  department_code: "",

  // non mandatory fields
  school_id: "",
  branch_id: "",
  teacher_adt_reg_no: "",
  card_number: "",
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
  file_adhaar_front: "",
  file_adhaar_back: "",
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
  password: "",
  confirm_password: "",
};

const CreateTeacher: React.FC<Props> = () => {
  let tabIndex = 1;
  const [data, setData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [isFilesModified, setIsFilesModified] = useState({
    file_passbook: false,
    file_adhaar: false,
    file_pancard: false,
    form_11: false,
  });
  const [minDates, setMinDates] = useState({
    date_of_joining: undefined,
  });
  const [passwordVisible, setPasswordVisible] = useState({
    password: false,
    confirm_password: false,
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
        const orderedData: any = {};
          console.log(res.data,"000000000000000000000000000000000000000000000000000000000");
        // Reorder keys to match initialState
        Object.keys(initialState).forEach((key) => {
          orderedData[key] = res.data.hasOwnProperty(key)
            ? res.data[key]
            : initialState[key];
        });

        // Handle any additional transformations
        orderedData.school_id = res?.data?.school;
        orderedData.date_of_birth = res?.data?.date_of_birth
          ? res?.data?.date_of_birth
          : "";
        orderedData.date_joining = res?.data?.date_joining
          ? res?.data?.date_joining
          : "";
        orderedData.date_of_leaving = res?.data?.date_of_leaving
          ? res?.data?.date_of_leaving
          : "";
        orderedData.date_of_retirement = res?.data?.date_of_retirement
          ? res?.data?.date_of_retirement
          : "";
        orderedData.pension_amount = res?.data?.pension_amount
          ? res?.data?.pension_amount
          : "";
        orderedData.gov_provident_fund = res?.data?.gov_provident_fund
          ? res?.data?.gov_provident_fund
          : "";

        setData(orderedData);

        if (orderedData?.date_of_birth) {
          setMinDates((prevState) => ({
            ...prevState,
            date_of_joining: orderedData.date_of_birth,
          }));
        }
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

    Fetch(url, id ? { ...params, school: data?.school.id, phone_number:data?.phone,phone_number_prefix:data?.phone_number_prefix } : params, {
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

  const { errors, handleSubmit, handleNewError } = FormC({
    values: {
      school: data?.school,
      email: data?.email,
      phone: data?.phone,
      teacher_code: data?.teacher_code,
      first_name: data?.first_name,
      last_name: data?.last_name,
      gender: data?.gender,
      department_code: data?.department_code,
    },
    onSubmit,
  });

  const handleSelectChange = (value: string, type: string) => {
    if (type === "date_of_birth") {
      setMinDates((prevState) => {
        return {
          ...prevState,
          date_of_joining: value,
        };
      });
    }
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
      case "card_number":
        return 16;
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

  const getMin = (key: string) => {
    switch (key) {
      case "date_of_retirement":
        return moment().format("YYYY-MM-DD");
      case "date_of_leaving":
        return moment().format("YYYY-MM-DD");
      case "date_of_joining":
        return data?.date_joining
          ? moment(data?.date_of_birth).format("YYYY-MM-DD")
          : undefined;
      default:
        return undefined;
    }
  };

  const getMax = (key: string) => {
    switch (key) {
      case "date_of_birth":
        return moment().subtract(18, "years").format("YYYY-MM-DD");
      case "last_date_of_leaving":
        return moment().subtract(1, "days").format("YYYY-MM-DD");
      default:
        return undefined;
    }
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
            error={
              errors?.school
                ? data?.school
                  ? errors?.school
                  : "Please select school."
                : ""
            }
            className="w-25"
            tabIndex={tabIndex++}
            name="school"
          />

          <div className={formStyles["form-grid"]}>
            {Object.keys(data)
              .filter((key) => !excludedKeys.includes(key))
              .map((key) => {
                if (key === "gender") {
                  return (
                    <Select
                      key={key}
                      label={`${mapKeyToLabel(key)}${
                        mandatoryFields.includes(key) ? "*" : ""
                      }`}
                      options={getGender()}
                      value={data?.gender}
                      onChange={(value) => handleSelectChange(value, "gender")}
                      error={
                        errors?.gender
                          ? data?.gender
                            ? errors?.gender
                            : "Please select gender."
                          : ""
                      }
                      tabIndex={tabIndex++}
                    />
                  );
                } else if (key === "marital_status") {
                  return (
                    <Select
                      key={key}
                      label={`${mapKeyToLabel(key)}${
                        mandatoryFields.includes(key) ? "*" : ""
                      }`}
                      options={getMaritalStatus()}
                      value={data?.marital_status}
                      onChange={(value) =>
                        handleSelectChange(value, "marital_status")
                      }
                      error={
                        errors?.marital_status
                          ? data?.marital_status
                            ? errors?.marital_status
                            : "Please select marital status."
                          : ""
                      }
                      tabIndex={tabIndex++}
                    />
                  );
                } else if (key === "blood_group") {
                  return (
                    <Select
                      key={key}
                      label={`${mapKeyToLabel(key)}${
                        mandatoryFields.includes(key) ? "*" : ""
                      }`}
                      options={getBloodGroups()}
                      value={data?.blood_group}
                      onChange={(value) =>
                        handleSelectChange(value, "blood_group")
                      }
                      error={
                        errors?.blood_group
                          ? data?.blood_group
                            ? errors?.blood_group
                            : "Please select blood group."
                          : ""
                      }
                      tabIndex={tabIndex++}
                    />
                  );
                } else if (key === "category_type") {
                  return (
                    <Select
                      key={key}
                      label={`${mapKeyToLabel(key)}${
                        mandatoryFields.includes(key) ? "*" : ""
                      }`}
                      options={getCategory()}
                      value={data?.category_type}
                      onChange={(value) =>
                        handleSelectChange(value, "category_type")
                      }
                      error={
                        errors?.category_type
                          ? data?.category_type
                            ? errors?.category_type
                            : "Please select category."
                          : ""
                      }
                      tabIndex={tabIndex++}
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
                      error={
                        errors?.status
                          ? data?.status
                            ? errors?.status
                            : "Please select status."
                          : ""
                      }
                      tabIndex={tabIndex++}
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
                      label={`${mapKeyToLabel(key)}${
                        mandatoryFields.includes(key) ? "*" : ""
                      }`}
                      selectedDate={data[key]}
                      onDateChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleSelectChange(e.target.value, key)
                      }
                      error={
                        errors[key]
                          ? data[key]
                            ? errors[key]
                            : `Please select ${mapKeyToLabel(
                                key
                              ).toLocaleLowerCase()}.`
                          : ""
                      }
                      className="w-100"
                      min={
                        key === "date_joining"
                          ? minDates.date_of_joining
                          : getMin(key)
                      }
                      max={getMax(key)}
                      tabIndex={tabIndex++}
                    />
                  );
                } else if (
                  key === "file_passbook" ||
                  key === "file_adhaar_front" ||
                  key === "file_pancard" ||
                  key === "form_11" ||
                  key === "file_adhaar_back"
                ) {
                  return (
                    <ImagePicker
                      key={key}
                      componentKey={key}
                      label={`${mapKeyToLabel(key)}${
                        mandatoryFields.includes(key) ? "*" : ""
                      }`}
                      value={getValue(key)}
                      onChange={(file: File | null) => {
                        handleFileChange(file, key);
                      }}
                      error={
                        errors?.[key] && `Please upload ${mapKeyToLabel(key)}`
                      }
                      tabIndex={tabIndex++}
                    />
                  );
                } else if (key === "password" || key === "confirm_password") {
                  return (
                    <div className={formStyles["form-column"]} key={key}>
                      <Input
                        label={`${mapKeyToLabel(key)}${
                          mandatoryFields.includes(key) ? "*" : ""
                        }`}
                        name={key}
                        defaultValue={data[key]}
                        onBlur={handleChange}
                        placeholder={`Enter ${mapKeyToLabel(
                          key
                        ).toLowerCase()}`}
                        error={
                          errors[key]
                            ? data[key]
                              ? errors[key]
                              : `Please enter ${mapKeyToLabel(
                                  key
                                ).toLocaleLowerCase()}.`
                            : ""
                        }
                        maxLength={getMaxLength(key)}
                        tabIndex={tabIndex++}
                        type={!passwordVisible[key] ? "password" : "text"}
                        iconRight={
                          !passwordVisible[key] ? <IconEye /> : <IconViewOff />
                        }
                        handleIconButtonClick={() =>
                          setPasswordVisible((prevState) => ({
                            ...prevState,
                            [key]: !prevState[key],
                          }))
                        }
                      />
                    </div>
                  );
                }
                return (
                  <div className={formStyles["form-column"]} key={key}>
                    <Input
                      label={`${mapKeyToLabel(key)}${
                        mandatoryFields.includes(key) ? "*" : ""
                      }`}
                      name={key}
                      defaultValue={data[key]}
                      onBlur={handleChange}
                      placeholder={`Enter ${mapKeyToLabel(key).toLowerCase()}`}
                      error={
                        errors[key]
                          ? data[key]
                            ? errors[key]
                            : `Please enter ${mapKeyToLabel(
                                key
                              ).toLocaleLowerCase()}.`
                          : ""
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
                      tabIndex={tabIndex++}
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
              buttonType="submit"
            />
          </div>
        </div>
      </form>
    </Layout>
  );
};

export default CreateTeacher;