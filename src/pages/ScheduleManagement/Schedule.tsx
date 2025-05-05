/* eslint-disable */
// @ts-nocheck

import Layout from "../../components/common/Layout/Layout";
import DataTable from "../../components/common/DataTable/DataTable";
import styles from "../../styles/Listing.module.css";
import Button from "../../components/common/Button/Button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DeleteIcon, EditIcon, IconEye } from "../../assets/svgs";
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
  const [classes, setClasses] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    currentPage: 1,
    itemsPerPage: 10,
  });

  const navigate = useNavigate();
  const toast = useToast();

  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedSchool, setSelectedSchool] = useState(
    searchParams.get("school") || ""
  );
  const [selectedClass, setSelectedClass] = useState(
    searchParams.get("class") || ""
  );

  const { schools } = useAppContext();

  const showToast = () => {
    toast.show("Schedule deleted successfully", 2000, "#4CAF50");
  };

  const selectClass = (id: string) => {
    setSelectedClass(id);
    const updatedParams: any = {
      school: selectedSchool,
      class: id,
    };
    setSearchParams(updatedParams);
    setPagination((prevState) => {
      return {
        ...prevState,
        currentPage: 1,
      };
    });
    getData(1, selectedSchool, id);
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

    setPagination((prevState) => {
      return {
        ...prevState,
        currentPage: 1,
      };
    });
    getData(1, id, selectedClass);
  };

  const getData = (
    page: number,
    school_id: string = "",
    class_id: string = ""
  ) => {
    setData([]);
    setIsLoading("listing");
    const offset = (page - 1) * pagination.itemsPerPage;
    Fetch(
      `schedule?school=${school_id}&sch_class=${class_id}&limit=${pagination.itemsPerPage}&offset=${offset}`
    ).then((res: any) => {
      if (res.status) {
        setData(res?.data?.results);
        setPagination((prev) => {
          return {
            ...prev,
            total: res.data?.count,
          };
        });
      }
      setIsLoading("");
    });
  };

  const handleDelete = () => {
    setIsLoading("delete");
    Fetch(`schedule/${itemToDelete}/`, {}, { method: "delete" }).then(
      (res: any) => {
        if (res.status) {
          if (pagination.total % pagination.itemsPerPage === 1) {
            if (pagination.currentPage === 1) {
              getData(1, selectedSchool, selectedClass);
            } else {
              setPagination((prevState) => {
                return {
                  ...prevState,
                  currentPage: Math.max(prevState.currentPage - 1, 1),
                };
              });
            }
          } else {
            getData(pagination.currentPage, selectedSchool, selectedClass);
          }
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
    getData(pagination.currentPage, selectedSchool, selectedClass);
  }, [schools, pagination.currentPage]);

  const handleDeleteRequest = (id: string) => {
    setItemToDelete(id);
    setShowModal(true);
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => {
      return {
        ...prev,
        currentPage: page,
      };
    });
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
          {item?.is_deleted ? (
            <Tooltip text="View">
              <button
                style={{
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                }}
                onClick={() => handleEdit(item?.id)}
              >
                <IconEye color="#1976d2" />
              </button>
            </Tooltip>
          ) : (
            <>
              <Tooltip text="Edit">
                <button
                  className="mr-3"
                  style={{
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                  }}
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
            </>
          )}
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
          itemsPerPage={pagination.itemsPerPage}
          currentPage={pagination.currentPage}
          totalRecords={pagination.total}
          onPageChange={handlePageChange}
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
        primaryButtonVariant="danger"
      />
    </Layout>
  );
}

export default Class;
