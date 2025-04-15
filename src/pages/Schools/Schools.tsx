import Layout from "../../components/common/Layout/Layout";
import DataTable from "../../components/common/DataTable/DataTable";
import styles from "../../styles/Listing.module.css";
import Button from "../../components/common/Button/Button";
import { useNavigate } from "react-router-dom";
import { DeleteIcon, EditIcon } from "../../assets/svgs";
import { useEffect, useState } from "react";
import Fetch from "../../utils/form-handling/fetch";
import Modal from "../../components/common/Modal/Modal";
import { useToast } from "../../contexts/Toast";

function Schools() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState<"listing" | "delete" | "">("");
  const [showModal, setShowModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState("");
  const navigate = useNavigate();
  const toast = useToast();

  const showToast = () => {
    toast.show("School deleted successfully", 2000, "#dc3545");
  };

  const getData = () => {
    setIsLoading("listing");
    Fetch("schools/").then((res: any) => {
      if (res.status) {
        setData(res.data);
      }
      setIsLoading("");
    });
  };

  const handleDelete = () => {
    setIsLoading("delete");
    Fetch(`schools/${itemToDelete}/`, {}, { method: "delete" }).then(
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
    navigate(`/schools/create/${id}`);
  };

  useEffect(() => {
    getData();
  }, []);

  const handleDeleteRequest = (id: string) => {
    setItemToDelete(id);
    setShowModal(true);
  };

  const columns = [
    { key: "name", header: "Name" },
    { key: "address", header: "Address" },
    { key: "phone", header: "Phone" },
    {
      key: "logo",
      header: "Logo",
      render: (item: any) => <img width={40} height={40} src={item.logo} />,
    },
    {
      key: "email",
      header: "Email Link",
      render: (item: any) => <a href={`mailto:${item.email}`}>{item.email}</a>,
    },
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
    navigate("/schools/create");
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
          <h2 className="mb-3">Schools</h2>
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
      />
    </Layout>
  );
}

export default Schools;
