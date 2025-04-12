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

function Teachers() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState<"listing" | "delete" | "">("");
  const [showModal, setShowModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState("");
  const navigate = useNavigate();
  const toast = useToast();

  const showToast = () => {
    toast.show("Teacher deleted successfully", 2000, "#dc3545");
  };

  const getData = () => {
    setIsLoading("listing");
    Fetch("teachers/").then((res: any) => {
      if (res.status) {
        setData(res.data);
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
    { key: "teacher_name", header: "Teacher Name" },
    { key: "teacher_comp_id", header: "Company ID" },
    { key: "teacher_branch_id", header: "Branch ID" },
    { key: "teacher_code", header: "Teacher Code" },
    { key: "teacher_adt_reg_no", header: "Registration Number" },
    { key: "teacher_card_no", header: "Card Number" },
    { key: "teacher_gender", header: "Gender" },
    { key: "teacher_email", header: "Email" },
    { key: "teacher_phone", header: "Phone Number" },
    { key: "teacher_emergency_number", header: "Emergency Number" },
    { key: "teacher_emergency_name", header: "Emergency Contact Name" },
    { key: "teacher_marital_status", header: "Marital Status" },
    { key: "teacher_blood_group", header: "Blood Group" },
    { key: "teacher_nomi_relation", header: "Nominee Relation" },
    { key: "teacher_location", header: "Location" },
    { key: "teacher_location_category", header: "Location Category" },
    { key: "teacher_department_code", header: "Department Code" },
    { key: "teacher_department_head", header: "Department Head" },
    { key: "teacher_add1", header: "Address Line 1" },
    { key: "teacher_add2", header: "Address Line 2" },
    { key: "teacher_city", header: "City" },
    { key: "teacher_state", header: "State" },
    { key: "teacher_permanent_address", header: "Permanent Address" },
    { key: "teacher_branch", header: "Branch" },
    { key: "teacher_date_of_birth", header: "Date of Birth" },
    { key: "teacher_date_joining", header: "Date of Joining" },
    { key: "teacher_date_of_leaving", header: "Date of Leaving" },
    { key: "teacher_department", header: "Department" },
    { key: "teacher_cat", header: "Category" },
    { key: "teacher_degn", header: "Designation" },
    { key: "teacher_grade", header: "Grade" },
    { key: "teacher_adhoc", header: "Adhoc" },
    { key: "teacher_adhaar", header: "Aadhaar Number" },
    { key: "teacher_pan", header: "PAN Number" },
    { key: "teacher_bank_name", header: "Bank Name" },
    { key: "teacher_bank", header: "Bank" },
    { key: "teacher_bankac", header: "Bank Account Number" },
    { key: "teacher_ifsc", header: "IFSC Code" },
    { key: "teacher_epf", header: "EPF" },
    { key: "teacher_pension", header: "Pension" },
    { key: "teacher_nominee", header: "Nominee" },
    { key: "teacher_uan", header: "UAN" },
    { key: "teacher_gov_pf", header: "Government PF" },
    { key: "teacher_gov_pf_num", header: "Government PF Number" },
    { key: "teacher_file_passbook", header: "Passbook File" },
    { key: "teacher_file_adhaar", header: "Aadhaar File" },
    { key: "teacher_file_pancard", header: "PAN Card File" },
    { key: "teacher_qualification", header: "Qualification" },
    { key: "teacher_university", header: "University" },
    { key: "teacher_spl", header: "Specialization" },
    { key: "teacher_status", header: "Status" },
    { key: "teacher_lastorg", header: "Last Organization" },
    { key: "teacher_lastdesi", header: "Last Designation" },
    { key: "teacher_ref", header: "Reference" },
    { key: "teacher_fmlyname1", header: "Family Member Name" },
    { key: "teacher_relname1", header: "Relation Name" },
    { key: "teacher_fmlyage1", header: "Family Member Age" },
    { key: "teacher_fmlyadhaar1", header: "Family Member Aadhaar" },
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
          height: "calc(100vh - 9rem)",
          backgroundColor: "#f8f9fa",
          padding: "20px",
          marginTop: "20px",
          maxWidth: "calc(100vw - 21rem)"
        }}
      >
        <div className={styles.titleContainer}>
          <h2 className="mb-3">Class</h2>
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

export default Teachers;
