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

  // const columns = [
  //   {
  //     key: "email",
  //     header: "Email Link",
  //     render: (item: any) => <a href={`mailto:${item.email}`}>{item.email}</a>,
  //   },
  //   { key: "phone", header: "Phone Number" },
  //   { key: "branch_id", header: "Branch ID" },
  //   { key: "teacher_code", header: "Teacher Code" },
  //   { key: "teacher_adt_reg_no", header: "Registration Number" },
  //   { key: "card_number", header: "Card Number" },
  //   { key: "first_name", header: "First Name" },
  //   { key: "last_name", header: "Last Name" },
  //   { key: "gender", header: "Gender" },
  //   { key: "emergency_number", header: "Emergency Contact Number" },
  //   { key: "emergency_name", header: "Emergency Contact Name" },
  //   { key: "marital_status", header: "Marital Status" },
  //   { key: "blood_group", header: "Blood Group" },
  //   { key: "nominee", header: "Nominee" },
  //   { key: "nominee_relation", header: "Nominee Relation" },
  //   { key: "location", header: "Location" },
  //   { key: "location_category", header: "Location Category" },
  //   {
  //     key: "organizational_classification",
  //     header: "Organizational Classification",
  //   },
  //   { key: "organizational_category", header: "Organizational Category" },
  //   { key: "department_code", header: "Department Code" },
  //   { key: "department_head", header: "Department Head" },
  //   { key: "immediate_reporting", header: "Immediate Reporting" },
  //   { key: "teacher_SRA", header: "SRA" },
  //   { key: "category_type", header: "Category Type" },
  //   { key: "address1", header: "Address Line 1" },
  //   { key: "address2", header: "Address Line 2" },
  //   { key: "city", header: "City" },
  //   { key: "state", header: "State" },
  //   { key: "permanent_address", header: "Permanent Address" },
  //   { key: "branch", header: "Branch" },
  //   { key: "date_of_birth", header: "Date of Birth" },
  //   { key: "date_joining", header: "Date of Joining" },
  //   { key: "date_of_leaving", header: "Date of Leaving" },
  //   { key: "reason", header: "Reason" },
  //   { key: "teacher_cofirm", header: "Confirmation" },
  //   { key: "date_of_retirement", header: "Date of Retirement" },
  //   { key: "department", header: "Department" },
  //   { key: "designation", header: "Designation" },
  //   { key: "grade", header: "Grade" },
  //   { key: "teacher_adhoc", header: "Adhoc" },
  //   { key: "adhaar", header: "Aadhaar Number" },
  //   { key: "pancard", header: "PAN Number" },
  //   { key: "bank_name", header: "Bank Name" },
  //   { key: "bank_account_number", header: "Bank Account Number" },
  //   { key: "bank_ifsc_code", header: "IFSC Code" },
  //   { key: "teacher_disp", header: "Dispensation" },
  //   { key: "pension_amount", header: "Pension Amount" },
  //   { key: "voluntary_provident_fund", header: "Voluntary Provident Fund" },
  //   {
  //     key: "universal_account_number",
  //     header: "Universal Account Number (UAN)",
  //   },
  //   { key: "gov_provident_fund", header: "Government Provident Fund" },
  //   {
  //     key: "gov_provided_fund_number",
  //     header: "Government Provident Fund Number",
  //   },
  //   {
  //     key: "file_passbook",
  //     header: "Passbook File",
  //     render: (item: any) => (
  //       <img width={40} height={40} src={item.file_passbook} />
  //     ),
  //   },
  //   {
  //     key: "file_adhaar",
  //     header: "Aadhaar File",
  //     render: (item: any) => (
  //       <img width={40} height={40} src={item.file_adhaar} />
  //     ),
  //   },
  //   {
  //     key: "file_pancard",
  //     header: "PAN Card File",
  //     render: (item: any) => (
  //       <img width={40} height={40} src={item.file_pancard} />
  //     ),
  //   },
  //   {
  //     key: "form_11",
  //     header: "Form 11",
  //     render: (item: any) => <img width={40} height={40} src={item.form_11} />,
  //   },
  //   { key: "academic_qualification", header: "Academic Qualification" },
  //   { key: "academic_university", header: "University" },
  //   { key: "specialization", header: "Specialization" },
  //   { key: "passing_year", header: "Passing Year" },
  //   { key: "last_school", header: "Last School" },
  //   { key: "last_designation", header: "Last Designation" },
  //   { key: "last_date_of_leaving", header: "Last Date of Leaving" },
  //   { key: "reference", header: "Reference" },
  //   { key: "family_name1", header: "Family Member Name 1" },
  //   { key: "relation_name1", header: "Relation Name 1" },
  //   { key: "family_age1", header: "Family Member Age 1" },
  //   { key: "family_adhaar1", header: "Family Member Aadhaar 1" },
  //   { key: "status", header: "Status" },
  //   {
  //     key: "actions",
  //     header: "Actions",
  //     render: (item: any) => (
  //       <div>
  //         <button
  //           style={{
  //             border: "none",
  //             background: "none",
  //             cursor: "pointer",
  //           }}
  //           className="mr-3"
  //           onClick={() => handleDeleteRequest(item?.id)}
  //         >
  //           <DeleteIcon size={20} color="#d32f2f" />
  //         </button>
  //         <button
  //           style={{ border: "none", background: "none", cursor: "pointer" }}
  //           onClick={() => handleEdit(item?.id)}
  //         >
  //           <EditIcon size={20} color="#1976d2" />
  //         </button>
  //       </div>
  //     ),
  //   },
  // ];

  const columns = [
    {
      key: "name",
      header: "Name",
      render: (item: any) =>
        `${item?.first_name || ""} ${item?.last_name || ""}`,
    },
    {
      key: "email",
      header: "Email Link",
      render: (item: any) => <a href={`mailto:${item.email}`}>{item.email}</a>,
    },
    { key: "teacher_code", header: "Teacher Code" },
    { key: "designation", header: "Designation" },
    { key: "department", header: "Department" },
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
          backgroundColor: "#f8f9fa",
          padding: "20px",
          marginTop: "20px",
          maxWidth: "calc(100vw - 21rem)",
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
