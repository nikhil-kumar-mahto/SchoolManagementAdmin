import Layout from "../../components/common/Layout/Layout";
import DataTable from "../../components/common/DataTable/DataTable";
import styles from "./Subject.module.css";
import Button from "../../components/common/Button/Button";
import { useNavigate } from "react-router-dom";
import { DeleteIcon, EditIcon } from "../../assets/svgs";
import { useEffect, useState } from "react";
import Fetch from "../../utils/form-handling/fetch";
import { arrayString } from "../../utils/form-handling/arrayString";

function Schools() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  console.log("data====", data);

  const getData = () => {
    setIsLoading(true);
    Fetch("subjects/").then((res: any) => {
      if (res.status) {
        setData(res.data);
      }
      setIsLoading(false);
    });
  };

  const handleDelete = (id: string) => {
    Fetch(`subjects/${id}/`, {}, { method: "delete" }).then((res: any) => {
      if (res.status) {
        getData();
      }
    });
  };

  const handleEdit = (id: string) => {
    navigate(`/subjects/create/${id}`);
  };

  useEffect(() => {
    getData();
  }, []);

  const columns = [
    { key: "name", header: "Name" },
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
            onClick={() => handleDelete(item?.id)}
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
    navigate("/subjects/create");
  };

  return (
    <Layout>
      <div
        style={{
          height: "100vh",
          backgroundColor: "#f8f9fa",
          padding: "20px",
          marginTop: "20px",
        }}
      >
        <div className={styles.titleContainer}>
          <h2 className="mb-3">Subjects</h2>
          <Button text="Create" onClick={handleNavigate} />
        </div>

        <DataTable data={data} columns={columns} itemsPerPage={10} />
      </div>
    </Layout>
  );
}

export default Schools;
