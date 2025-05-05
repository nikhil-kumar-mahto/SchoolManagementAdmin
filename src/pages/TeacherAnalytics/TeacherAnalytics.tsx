import Layout from "../../components/common/Layout/Layout";
import DataTable from "../../components/common/DataTable/DataTable";
import styles from "../../styles/Listing.module.css";
import Button from "../../components/common/Button/Button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DeleteIcon, EditIcon } from "../../assets/svgs";
import { useEffect, useState } from "react";
import Fetch from "../../utils/form-handling/fetch";
import Modal from "../../components/common/Modal/Modal";
import { useAppContext } from "../../contexts/AppContext";
import Select from "../../components/common/Select/Select";
import Tooltip from "../../components/common/ToolTip/ToolTip";
import DatePicker from "../../components/DatePicker/DatePicker";

function TeacherAnalytics() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState<"listing" | "delete" | "">("");
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [weekly, setWeekly] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedSchool, setSelectedSchool] = useState(
    searchParams.get("school") || ""
  );
  const [selectedClass, setSelectedClass] = useState(
    searchParams.get("class") || ""
  );

  const { schools } = useAppContext();

  const selectClass = (id: string) => {
    setSelectedClass(id);
    const updatedParams: any = {
      school: selectedSchool,
      class: id,
    };
    setSearchParams(updatedParams);
    getData(selectedSchool, id);
  };

  const selectSchool = (id: string) => {
    setSelectedClass("");

    let classes = schools
      .find((item) => item?.value === id)
      ?.classes?.map((item) => ({
        label: item?.name + " " + item?.section,
        value: item?.id,
      }));

    setClasses(classes);
    setSelectedSchool(id);

    const updatedParams: any = { school: id };
    setSearchParams(updatedParams);

    getData(id, selectedClass);
  };

  const getData = (school_id: string = "", class_id: string = "") => {
    setIsLoading("listing");
    // Fetch(`schedule?school_id=${school_id}&class_id=${class_id}`).then(
    //   (res: any) => {
    //     if (res.status) {
    //       setData(res?.data);
    //     }
    //     setIsLoading("");
    //   }
    // );
  };

 const dummyData = [
   {
     id: 1,
     first_name: "John",
     last_name: "Doe",
     email: "john.doe@example.com",
     phone_number: "1234567890",
     teacher_code: "T123",
     gender: "Male",
   },
   {
     id: 2,
     first_name: "Jane",
     last_name: "Smith",
     email: "jane.smith@example.com",
     phone_number: "0987654321",
     teacher_code: "T124",
     gender: "Female",
   },
 ];

 // Columns Definition
 const columns = [
   {
     key: "Teacher",
     header: "Teacher",
     render: (item: any) =>
       `${item?.first_name || ""} ${item?.last_name || ""}`,
   },
   {
     key: "email",
     header: "Email",
     render: (item: any) => <a href={`mailto:${item.email}`}>{item.email}</a>,
   },
   { key: "phone_number", header: "Phone" },
   { key: "teacher_code", header: "Teacher Code" },
   { key: "gender", header: "Gender" },
   {
     key: "actions",
     header: "Actions",
     render: (item: any) => (
       <div>
         <Tooltip text="Edit">
           <button
             style={{ border: "none", background: "none", cursor: "pointer" }}
             onClick={() => handleEdit(item?.id)}
             className="mr-3"
           >
             <EditIcon size={20} color="#1976d2" />
           </button>
         </Tooltip>

         <Tooltip text="Delete">
           <button
             style={{
               border: "none",
               background: "none",
               cursor: "pointer",
             }}
             onClick={() => handleDeleteRequest(item?.id)}
           >
             <DeleteIcon size={20} color="#d32f2f" />
           </button>
         </Tooltip>
       </div>
     ),
   },
 ];

  useEffect(() => {
    const school = searchParams.get("school") || "";
    const classId = searchParams.get("class") || "";
    setSelectedSchool(school);
    setSelectedClass(classId);

    const schoolClasses =
      schools
        .find((item) => item?.value === school)
        ?.classes?.map((item) => ({
          label: item?.name + " " + item?.section,
          value: item?.id,
        })) || [];

    setClasses(schoolClasses);
    getData(school, classId);
  }, [schools]);

  return (
    <Layout>
      <div
        style={{
          backgroundColor: "#f8f9fa",
          padding: "20px",
          marginTop: "20px",

          height: "calc(100vh - 10rem)",
        }}
      >
        <div className={styles.titleContainer}>
          <h2 className="mb-3">Teacher Analytics</h2>
        </div>

        <div className={`${styles.selectContainer}`}>
          <Select
            label="Select school"
            options={schools as { value: string; label: string }[]}
            value={selectedSchool}
            onChange={selectSchool}
          />

          <Select
            label="Select teacher"
            options={classes}
            value={selectedClass}
            onChange={selectClass}
          />
        </div>
        <div
          className={`${styles.selectContainer} mt-4`}
          style={{
            alignItems: "center",
            // background:"red",
            justifyContent: "center",
          }}
        >
          <DatePicker
            label="To Date"
            selectedDate={"2025-04-01"}
            onDateChange={() => {}}
            error={undefined}
            type="date"
            className={styles.datePicker}
            style={{ width: "250px" }}
          />
          <DatePicker
            label="From   Date"
            selectedDate={"2025-04-01"}
            onDateChange={() => {}}
            error={undefined}
            type="date"
            className={styles.datePicker}
            style={{ width: "250px" }}
          />
          <Select label="Weekly" options={weekly} style={{ width: "200px" }} />
          <Select
            label="Quaterly"
            options={weekly}
            style={{ width: "200px" }}
          />
          <Button text="Filter" className={styles.button} />
        </div>
        <DataTable
          data={data}
          columns={columns}
          itemsPerPage={10}
          // isLoading={isLoading === "listing"}
        />
      </div>
    </Layout>
  );
}

export default TeacherAnalytics;
