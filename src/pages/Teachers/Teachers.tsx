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
import Tooltip from "../../components/common/ToolTip/ToolTip";

function Teachers() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState<"listing" | "delete" | "">("");
  const [showModal, setShowModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState("");
  const navigate = useNavigate();
  const toast = useToast();

  const showToast = () => {
    toast.show("Teacher deleted successfully", 2000, "#4CAF50");
  };

  const getData = () => {
    setIsLoading("listing");
    Fetch("teachers/?limit=40&offset=0").then((res: any) => {
      if (res.status) {
        setData(res.data?.results);
      }
      setIsLoading("");
    });
  };

  const handleDelete = () => {
    setIsLoading("delete");
    Fetch(`teachers/${itemToDelete}/`, {}, { method: "delete" }).then(
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
    navigate(`/teachers/create/${id}`);
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
      key: "school_name",
      header: "School",
      render: (item: any) => `${item?.school?.name}`,
    },
    {
      key: "name",
      header: "Name",
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
  const handleNavigate = () => {
    navigate("/teachers/create");
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
          <h2 className="mb-3">Teachers</h2>
          <Button text="Create" onClick={handleNavigate} />
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
        message="Are you sure you want to delete this item?"
        onConfirm={handleDelete}
        onCancel={handleCancel}
        visible={showModal}
        isLoading={isLoading === "delete"}
        primaryButtonVariant="danger"
      />
    </Layout>
  );
}

export default Teachers;
