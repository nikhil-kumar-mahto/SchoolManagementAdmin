import Layout from "../../components/common/Layout/Layout";
import DataTable from "../../components/common/DataTable/DataTable";
import styles from "../../styles/Listing.module.css";
import Button from "../../components/common/Button/Button";
import { useNavigate } from "react-router-dom";
import { DeleteIcon, EditIcon } from "../../assets/svgs";
import { useEffect, useState } from "react";
import Fetch from "../../utils/form-handling/fetch";
import { useToast } from "../../contexts/Toast";
import Modal from "../../components/common/Modal/Modal";
import { useAppContext } from "../../contexts/AppContext";
import Select from "../../components/common/Select/Select";

function Class() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState<"listing" | "delete" | "">("");
  const [showModal, setShowModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState("");
  const navigate = useNavigate();
  const toast = useToast();
  const [classes, setClasses] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedClass, setSelectedClass] = useState("");

  const { schools } = useAppContext();

  const showToast = () => {
    toast.show("Schedule deleted successfully", 2000, "#dc3545");
  };

  const getClasses = (id: string) => {
    Fetch(`classes?school_id=${id}`).then((res: any) => {
      if (res.status) {
        let classes = res.data?.map(
          (item: { name: string; id: string; section: string }) => {
            return {
              label: item?.name + " " + item?.section,
              value: item?.id,
            };
          }
        );
        setClasses(classes);
      }
    });
  };

  const selectClass = (id: string) => {
    // modify data in this
    let filteredData = data.filter((item) => item.id === id);
    setFilteredData(filteredData);
    setSelectedClass(id);
  };

  const selectSchool = (id: string) => {
    setSelectedClass("");
    getClasses(id);
    setSelectedSchool(id);
  };

  const getData = () => {
    setIsLoading("listing");
    Fetch("schedule/").then((res: any) => {
      if (res.status) {
        setData(res.data.filter((item) => item?.time_slots.length > 0));
        setFilteredData(res.data.filter((item) => item?.time_slots.length > 0));
      }
      setIsLoading("");
    });
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
    getData();
  }, []);

  const handleDeleteRequest = (id: string) => {
    setItemToDelete(id);
    setShowModal(true);
  };

  const columns = [
    {
      key: "school",
      header: "School",
      render: (item: any) => item?.school?.name,
    },
    {
      key: "class",
      header: "Class",
      render: (item: any) => item?.name + " " + item?.section,
    },
    {
      key: "schedules",
      header: "Schedules",
      render: (item: any) =>
        [
          ...new Set(
            item.time_slots.map((item) => item?.day_of_week ?? item?.date)
          ),
        ].join(", "),
    },
    {
      key: "actions",
      header: "Actions",
      render: (item: any) => (
        <div>
          {/* <button
            style={{
              border: "none",
              background: "none",
              cursor: "pointer",
            }}
            className="mr-3"
            onClick={() => handleDeleteRequest(item?.id)}
          >
            <DeleteIcon size={20} color="#d32f2f" />
          </button> */}
          <button
            style={{ border: "none", background: "none", cursor: "pointer" }}
            onClick={() => handleEdit(item?.id)}
          >
            <EditIcon size={20} color="#1976d2" />
          </button>
        </div>
      ),
    },
  ];

  const handleNavigate = () => {
    navigate("/schedule/create");
  };

  const handleCancel = () => {
    setItemToDelete("");
    setShowModal(false);
  };

  return (
    <Layout>
      <div
        style={{
          // height: "calc(100vh - 9rem)",
          backgroundColor: "#f8f9fa",
          padding: "20px",
          marginTop: "20px",
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
          data={filteredData}
          columns={columns}
          itemsPerPage={10}
          isLoading={isLoading === "listing"}
        />
      </div>
      <Modal
        title="Confirm!"
        message="Are you sure you want to delete this item?"
        onConfirm={handleDelete}
        onCancel={handleCancel}
        visible={showModal}
        isLoading={isLoading === "delete"}
      />
    </Layout>
  );
}

export default Class;
