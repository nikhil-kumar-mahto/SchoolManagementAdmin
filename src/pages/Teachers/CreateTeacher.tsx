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
import {
  getBloodGroups,
  getGender,
  getMaritalStatus,
  mapKeyToLabel,
} from "../../utils/common/utility-functions";
import formStyles from "./Teachers.module.css";

interface Props {}

const initialState = {
  teacher_name: "",
  // teacher_school_id: "",
  teacher_comp_id: "",
  teacher_branch_id: "",
  teacher_code: "",
  teacher_adt_reg_no: "",
  teacher_card_no: "",
  // teacher_fname: "",
  teacher_gender: "",
  teacher_email: "",
  teacher_phone: "",
  teacher_emergency_number: "",
  teacher_emergency_name: "",
  teacher_marital_status: "",
  teacher_blood_group: "",
  teacher_nomi_relation: "",
  teacher_location: "",
  teacher_location_category: "",
  // teacher_oec_classification: "",
  // teacher_oec_category: "",
  // teacher_shop_category: "",
  teacher_department_code: "",
  teacher_department_head: "",
  // teacher_immediate_reporting: "",
  // teacher_SRA: "",
  teacher_add1: "",
  teacher_add2: "",
  teacher_city: "",
  teacher_state: "",
  teacher_permanent_address: "",
  teacher_branch: "",
  teacher_date_of_birth: "",
  teacher_date_joining: "",
  // teacher_doc: "",
  teacher_date_of_leaving: "",
  // teacher_reason: "",
  // teacher_cofirm: "",
  // teacher_dor: "",
  teacher_department: "",
  teacher_cat: "",
  teacher_degn: "",
  teacher_grade: "",
  teacher_adhoc: "",
  teacher_adhaar: "",
  teacher_pan: "",
  teacher_bank_name: "",
  teacher_bank: "",
  teacher_bankac: "",
  teacher_ifsc: "",
  // teacher_esi: "",
  // teacher_disp: "",
  // teacher_esic_mapping: "",
  // teacher_gmc: "",
  teacher_epf: "",
  teacher_pension: "",
  // teacher_VPF: "",
  // teacher_epsdoj: "",
  teacher_nominee: "",
  teacher_uan: "",
  teacher_gov_pf: "",
  teacher_gov_pf_num: "",
  teacher_file_passbook: "",
  teacher_file_adhaar: "",
  teacher_file_pancard: "",
  // teacher_file_tic: "",
  // teacher_form_11: "",
  teacher_qualification: "",
  teacher_university: "",
  teacher_spl: "",
  // teacher_pass: "",
  teacher_status: "",
  teacher_lastorg: "",
  teacher_lastdesi: "",
  // teacher_lastdol: "",
  teacher_ref: "",
  teacher_fmlyname1: "",
  // teacher_fmlyname2: "",
  // teacher_fmlyname3: "",
  // teacher_fmlyname4: "",
  // teacher_fmlyname5: "",
  // teacher_fmlyname6: "",
  teacher_relname1: "",
  // teacher_relname2: "",
  // teacher_relname3: "",
  // teacher_relname4: "",
  // teacher_relname5: "",
  // teacher_relname6: "",
  teacher_fmlyage1: "",
  // teacher_fmlyage2: "",
  // teacher_fmlyage3: "",
  // teacher_fmlyage4: "",
  // teacher_fmlyage5: "",
  // teacher_fmlyage6: "",
  teacher_fmlyadhaar1: "",
  // teacher_fmlyadhaar2: "",
  // teacher_fmlyadhaar3: "",
  // teacher_fmlyadhaar4: "",
  // teacher_fmlyadhaar5: "",
  // teacher_fmlyadhaar6: "",
  // teacher_1: "",
  // teacher_2: "",
  // teacher_3: "",
  // teacher_4: "",
  // teacher_5: "",
  // teacher_6: "",
  // teacher_salary_bank_map: "",
  // teacher_sal_match: "",
  // teacher_hide_ateen: "",
  school: "",
};

const CreateTeacher: React.FC<Props> = () => {
  const [data, setData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [schools, setSchools] = useState([]);

  const excludedKeys = ["id", "teacher_school_id", "school"];

  const { id } = useParams();

  const navigate = useNavigate();
  const toast = useToast();

  const showToast = (message: string) => {
    toast.show(message, 2000, "#4CAF50");
  };

  const getTeacherInfo = () => {
    Fetch(`teachers/${id}/`).then((res: any) => {
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
    Fetch(url, data, { method: id ? "patch" : "post" }).then((res: any) => {
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
    values: data,
    onSubmit,
  });

  const handleSelectChange = (value: string, type: string) => {
    setData((prevData) => ({
      ...prevData,
      [type]: value,
    }));
  };

  useEffect(() => {
    getSchools();
    if (id) {
      getTeacherInfo();
    }
  }, []);

  return (
    <Layout>
      <form action="" onSubmit={handleSubmit}>
        <div className={styles.container}>
          <h2>{id ? "Update" : "Create"} Teacher</h2>
          <Select
            label="Select school"
            options={schools}
            value={data?.school}
            onChange={(value) => handleSelectChange(value, "school")}
            error={errors?.school}
          />

          <div className={formStyles["form-grid"]}>
            {Object.keys(data)
              .filter((key) => !excludedKeys.includes(key))
              .map((key) => {
                if (key === "teacher_gender") {
                  return (
                    <Select
                      label="Select gender"
                      options={getGender()}
                      value={data?.teacher_gender}
                      onChange={(value) =>
                        handleSelectChange(value, "teacher_gender")
                      }
                      error={errors?.teacher_gender}
                    />
                  );
                } else if (key === "teacher_marital_status") {
                  return (
                    <Select
                      label="Select marital status"
                      options={getMaritalStatus()}
                      value={data?.teacher_marital_status}
                      onChange={(value) =>
                        handleSelectChange(value, "teacher_marital_status")
                      }
                      error={errors?.teacher_marital_status}
                    />
                  );
                } else if (key === "teacher_blood_group") {
                  return (
                    <Select
                      label="Select blood group"
                      options={getBloodGroups()}
                      value={data?.teacher_blood_group}
                      onChange={(value) =>
                        handleSelectChange(value, "teacher_blood_group")
                      }
                      error={errors?.teacher_blood_group}
                    />
                  );
                }
                return (
                  <div className={formStyles["form-column"]} key={key}>
                    <Input
                      label={mapKeyToLabel(key)}
                      name={key}
                      value={data[key]}
                      onChange={handleChange}
                      placeholder={`Enter ${mapKeyToLabel(key).toLowerCase()}`}
                      error={errors[key]}
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
