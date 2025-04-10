import Layout from "../../components/common/Layout/Layout";
import DataTable from "../../components/common/DataTable/DataTable";
import styles from "./Schedule.module.css";
import Button from "../../components/common/Button/Button";
import { useNavigate } from "react-router-dom";
import { DeleteIcon, EditIcon } from "../../assets/svgs";
import { useEffect, useState } from "react";
import Fetch from "../../utils/form-handling/fetch";
import { arrayString } from "../../utils/form-handling/arrayString";

function Schedule() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  console.log("data====", data);

  const getData = () => {
    setIsLoading(true);
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
      setIsLoading(false);
    });
  };

  const handleDelete = (id: string) => {
    Fetch(`schedule/${id}/`, {}, { method: "delete" }).then((res: any) => {
      if (res.status) {
        getData();
      }
    });
  };

  const handleEdit = (id: string) => {
    navigate(`/schedule/create/${id}`);
  };

  useEffect(() => {
    getData();
  }, []);

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
    navigate("/schedule/create");
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
          <h2 className="mb-3">Schedule</h2>
          <Button text="Create" onClick={handleNavigate} />
        </div>

        <DataTable data={data} columns={columns} itemsPerPage={10} />
      </div>
    </Layout>
  );
}

export default Schedule;
