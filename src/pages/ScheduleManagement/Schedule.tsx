import Layout from "../../components/common/Layout/Layout";
import DataTable from "../../components/common/DataTable/DataTable";
import styles from "../../styles/Listing.module.css";
import Button from "../../components/common/Button/Button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DeleteIcon, EditIcon } from "../../assets/svgs";
import { useEffect, useState } from "react";
import Fetch from "../../utils/form-handling/fetch";
import { useToast } from "../../contexts/Toast";
import Modal from "../../components/common/Modal/Modal";
import { useAppContext } from "../../contexts/AppContext";
import Select from "../../components/common/Select/Select";
import Tooltip from "../../components/common/ToolTip/ToolTip";

function Class() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState<"listing" | "delete" | "">("");
  const [showModal, setShowModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState("");
  const navigate = useNavigate();
  const toast = useToast();
  const [classes, setClasses] = useState([]);

  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedSchool, setSelectedSchool] = useState(
    searchParams.get("school") || ""
  );
  const [selectedClass, setSelectedClass] = useState(
    searchParams.get("class") || ""
  );

  const { schools } = useAppContext();

  const showToast = () => {
    toast.show("Schedule deleted successfully", 2000, "#dc3545");
  };

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
    Fetch(`schedule?school_id=${school_id}&class_id=${class_id}`).then(
      (res: any) => {
        if (res.status) {
          setData(res?.data);
        }
        setIsLoading("");
      }
    );
  };

  const handleDelete = () => {
    setIsLoading("delete");
    Fetch(`schedule/${itemToDelete}/`, {}, { method: "delete" }).then(
      (res: any) => {
        if (res.status) {
          getData();
          showToast();
        }
        setShowModal(false);
        setIsLoading("listing");
      }
    );
  };

  const handleEdit = (id: string) => {
    navigate(`/schedule/create/${id}`);
  };

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

  const handleDeleteRequest = (id: string) => {
    setItemToDelete(id);
    setShowModal(true);
  };

  const columns = [
    {
      key: "school_name",
      header: "School",
    },
    {
      key: "class_name",
      header: "Class",
      render: (item: any) => item?.class_name + " " + item?.section,
    },
    {
      key: "slots",
      header: "Schedules",
      render: (item: any) =>
        !!item?.slots?.date ? item?.slots?.date : item?.slots?.day_of_week,
    },
    {
      key: "actions",
      header: "Actions",
      render: (item: any) => (
        <div>
          <Tooltip text="Edit">
            <button
              className="mr-3"
              style={{ border: "none", background: "none", cursor: "pointer" }}
              onClick={() => handleEdit(item?.id)}
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

  const handleNavigate = () => {
    navigate(
      `/schedule/create?school=${selectedSchool}&class=${selectedClass}`
    );
  };

  const handleCancel = () => {
    setItemToDelete("");
    setShowModal(false);
  };

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
          <h2 className="mb-3">Schedule</h2>
          <Button text="Create" onClick={handleNavigate} />
        </div>

        <div className={`${styles.selectContainer} mt-4`}>
          <Select
            label="Select school"
            options={schools as { value: string; label: string }[]}
            value={selectedSchool}
            onChange={selectSchool}
          />

          <Select
            label="Select class"
            options={classes}
            value={selectedClass}
            onChange={selectClass}
          />
        </div>

        <DataTable
          data={data}
          columns={columns}
          itemsPerPage={10}
          isLoading={isLoading === "listing"}
        />
      </div>
      <Modal
        title="Confirm!"
        message="Are you sure you want to delete this schedule?"
        onConfirm={handleDelete}
        onCancel={handleCancel}
        visible={showModal}
        isLoading={isLoading === "delete"}
      />
    </Layout>
  );
}

export default Class;
