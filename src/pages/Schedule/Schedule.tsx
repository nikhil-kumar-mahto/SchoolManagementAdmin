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

function Schedule() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState<"listing" | "delete" | "">("");
  const [showModal, setShowModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState("");
  const navigate = useNavigate();
  const toast = useToast();

  const showToast = () => {
    toast.show("Schedule deleted successfully", 2000, "#dc3545");
  };

  const getData = () => {
    setIsLoading("listing");
    Fetch("schedule/").then((res: any) => {
      if (res.status) {
        let formattedData = res.data.map((item: any) => {
          return {
            id: item?.id,
            class_assigned:
              item?.class_assigned?.name + item?.class_assigned?.section,
            subject: item?.subject?.name,
            teacher: item?.teacher?.name,
            school: item?.teacher?.school?.name,
            start_time: item?.start_time,
            end_time: item?.end_time,
            day: item?.day,
          };
        });
        setData(formattedData);
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
    { key: "class_assigned", header: "Class" },
    { key: "subject", header: "Subject" },
    { key: "teacher", header: "Teacher" },
    { key: "school", header: "School" },
    { key: "start_time", header: "Start Time" },
    { key: "end_time", header: "End Time" },
    { key: "day", header: "Day" },
    {
      key: "actions",
      header: "Actions",
      render: (item: any) => (
        <div>
          <button
            style={{
              border: "none",
              background: "none",
              cursor: "pointer",
            }}
            className="mr-3"
            onClick={() => handleDeleteRequest(item?.id)}
          >
            <DeleteIcon size={20} color="#d32f2f" />
          </button>
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
          height: "calc(100vh - 9rem)",
          backgroundColor: "#f8f9fa",
          padding: "20px",
          marginTop: "20px",
        }}
      >
        <div className={styles.titleContainer}>
          <h2 className="mb-3">Schedule</h2>
          <Button text="Create" onClick={handleNavigate} />
        </div>

        <DataTable
          data={data}
          columns={columns}
          itemsPerPage={10}
          isLoading={isLoading === "listing"}
        />
        <Modal
          title="Confirm!"
          message="Are you sure you want to delete this item?"
          onConfirm={handleDelete}
          onCancel={handleCancel}
          visible={showModal}
          isLoading={isLoading === "delete"}
        />
      </div>
    </Layout>
  );
}

export default Schedule;
