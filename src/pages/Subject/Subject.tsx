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

function Subject() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState<"listing" | "delete" | "">("");
  const [showModal, setShowModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState("");
  const [pagination, setPagination] = useState({
    total: 0,
    currentPage: 1,
    itemsPerPage: 10,
  });

  const navigate = useNavigate();
  const toast = useToast();

  const showToast = () => {
    toast.show("Subject deleted successfully", 2000, "#4CAF50");
  };

  const getData = (page: number) => {
    setIsLoading("listing");
    const offset = (page - 1) * pagination.itemsPerPage;
    Fetch(`subjects/?limit=${pagination.itemsPerPage}&offset=${offset}`).then(
      (res: any) => {
        if (res.status) {
          setData(res.data?.results);
          setPagination((prev) => {
            return {
              ...prev,
              total: res.data?.count,
            };
          });
        }
        setIsLoading("");
      }
    );
  };

  const handleDelete = () => {
    setIsLoading("delete");
    Fetch(`subjects/${itemToDelete}/`, {}, { method: "delete" }).then(
      (res: any) => {
        if (res.status) {
          if (pagination.total % pagination.itemsPerPage === 1) {
            if (pagination.currentPage === 1) {
              getData(1);
            } else {
              setPagination((prevState) => {
                return {
                  ...prevState,
                  currentPage: Math.max(prevState.currentPage - 1, 1),
                };
              });
            }
          } else {
            getData(pagination.currentPage);
          }
          showToast();
        }
        setShowModal(false);
        setIsLoading("listing");
      }
    );
  };

  const handleEdit = (id: string) => {
    navigate(`/subjects/create/${id}`);
  };

  const handleDeleteRequest = (id: string) => {
    setItemToDelete(id);
    setShowModal(true);
  };

  useEffect(() => {
    getData(pagination.currentPage);
  }, [pagination.currentPage]);

  const columns = [
    { key: "name", header: "Name" },
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
    navigate("/subjects/create");
  };

  const handleCancel = () => {
    setItemToDelete("");
    setShowModal(false);
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => {
      return {
        ...prev,
        currentPage: page,
      };
    });
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
          <h2 className="mb-3">Subjects</h2>
          <Button text="Create" onClick={handleNavigate} />
        </div>

        <DataTable
          data={data}
          columns={columns}
          itemsPerPage={pagination.itemsPerPage}
          currentPage={pagination.currentPage}
          totalRecords={pagination.total}
          onPageChange={handlePageChange}
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

export default Subject;
