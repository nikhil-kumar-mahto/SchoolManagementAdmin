import moment from "moment";

export function getIdFromUrl(url: any) {
  if (!url) {
    return false;
  }

  const parts = url.split("/");
  const lastPart = parts[parts.length - 1];

  if (!isNaN(lastPart)) {
    return lastPart;
  }

  const queryParams = url.split("?")[1];
  if (queryParams) {
    const params = queryParams.split("&");
    for (const param of params) {
      const [key, value] = param.split("=");
      if (key === "id") {
        return value;
      }
    }
  }

  const idMatch = url.match(/\/(\d+)(?:[^\d]|$)/);
  if (idMatch && idMatch[1]) {
    return idMatch[1];
  }

  return false;
}

export function generateTimeArray() {
  const timeArray = [];

  for (let hour = 0; hour < 24; hour++) {
    const time = moment({ hour });
    timeArray.push({
      value: time.format("HH:mm"),
      label: time.format("hh:mm A"),
    });
  }

  return timeArray;
}

export function filterTimeArray(startTime) {
  if (startTime === "23:00") {
    return [{ value: "00:00", label: "12:00 AM" }];
  }

  const timeArray = generateTimeArray();
  if (!startTime) {
    return timeArray;
  }

  let startHour;
  if (typeof startTime === "string") {
    const parsedTime = moment(startTime, "HH:mm", true);
    if (parsedTime.isValid()) {
      startHour = parsedTime.hour();
    } else {
      throw new Error("Invalid time format. Please use 'HH:mm' format.");
    }
  } else if (typeof startTime === "number") {
    startHour = startTime;
  } else {
    throw new Error(
      "Invalid input type. Please provide a number or a string in 'HH:mm' format."
    );
  }

  return timeArray.filter((time) => {
    const hour = parseInt(time.value.split(":")[0], 10);
    return hour > startHour;
  });
}

export const mapKeyToLabel = (key: string) => {
  switch (key) {
    case "teacher_name":
      return "Teacher Name";
    case "teacher_comp_id":
      return "Company ID";
    case "teacher_branch_id":
      return "Branch ID";
    case "teacher_code":
      return "Teacher Code";
    case "teacher_adt_reg_no":
      return "Registration Number";
    case "teacher_card_no":
      return "Card Number";
    case "teacher_fname":
      return "First Name";
    case "teacher_gender":
      return "Gender";
    case "teacher_email":
      return "Email Address";
    case "teacher_phone":
      return "Phone Number";
    case "teacher_emergency_number":
      return "Emergency Contact Number";
    case "teacher_emergency_name":
      return "Emergency Contact Name";
    case "teacher_marital_status":
      return "Marital Status";
    case "teacher_blood_group":
      return "Blood Group";
    case "teacher_nomi_relation":
      return "Nominee Relation";
    case "teacher_location":
      return "Location";
    case "teacher_location_category":
      return "Location Category";
    case "teacher_oec_classification":
      return "OEC Classification";
    case "teacher_oec_category":
      return "OEC Category";
    case "teacher_shop_category":
      return "Shop Category";
    case "teacher_department_code":
      return "Department Code";
    case "teacher_department_head":
      return "Department Head";
    case "teacher_immediate_reporting":
      return "Immediate Reporting";
    case "teacher_SRA":
      return "SRA";
    case "teacher_add1":
      return "Address Line 1";
    case "teacher_add2":
      return "Address Line 2";
    case "teacher_city":
      return "City";
    case "teacher_state":
      return "State";
    case "teacher_permanent_address":
      return "Permanent Address";
    case "teacher_branch":
      return "Branch";
    case "teacher_date_of_birth":
      return "Date of Birth";
    case "teacher_date_joining":
      return "Date of Joining";
    case "teacher_doc":
      return "Document";
    case "teacher_date_of_leaving":
      return "Date of Leaving";
    case "teacher_reason":
      return "Reason";
    case "teacher_cofirm":
      return "Confirmation";
    case "teacher_dor":
      return "Date of Resignation";
    case "teacher_department":
      return "Department";
    case "teacher_cat":
      return "Category";
    case "teacher_degn":
      return "Designation";
    case "teacher_grade":
      return "Grade";
    case "teacher_adhoc":
      return "Adhoc";
    case "teacher_adhaar":
      return "Adhaar Number";
    case "teacher_pan":
      return "PAN";
    case "teacher_bank_name":
      return "Bank Name";
    case "teacher_bank":
      return "Bank";
    case "teacher_bankac":
      return "Bank Account";
    case "teacher_ifsc":
      return "IFSC Code";
    case "teacher_esi":
      return "ESI Number";
    case "teacher_disp":
      return "Dispensation";
    case "teacher_esic_mapping":
      return "ESIC Mapping";
    case "teacher_gmc":
      return "GMC";
    case "teacher_epf":
      return "EPF";
    case "teacher_pension":
      return "Pension";
    case "teacher_VPF":
      return "VPF";
    case "teacher_epsdoj":
      return "EPS DOJ";
    case "teacher_nominee":
      return "Nominee";
    case "teacher_uan":
      return "UAN";
    case "teacher_gov_pf":
      return "Government PF";
    case "teacher_gov_pf_num":
      return "Government PF Number";
    case "teacher_file_passbook":
      return "Passbook";
    case "teacher_file_adhaar":
      return "Adhaar File";
    case "teacher_file_pancard":
      return "Pancard File";
    case "teacher_file_tic":
      return "TIC File";
    case "teacher_form_11":
      return "Form 11";
    case "teacher_qualification":
      return "Qualification";
    case "teacher_university":
      return "University";
    case "teacher_spl":
      return "Specialization";
    case "teacher_pass":
      return "Password";
    case "teacher_status":
      return "Status";
    case "teacher_lastorg":
      return "Last Organization";
    case "teacher_lastdesi":
      return "Last Designation";
    case "teacher_lastdol":
      return "Last Date of Leave";
    case "teacher_ref":
      return "Reference";
    case "teacher_fmlyname1":
      return "Family Member Name";
    case "teacher_fmlyname2":
      return "Family Member 2 Name";
    case "teacher_fmlyname3":
      return "Family Member 3 Name";
    case "teacher_fmlyname4":
      return "Family Member 4 Name";
    case "teacher_fmlyname5":
      return "Family Member 5 Name";
    case "teacher_fmlyname6":
      return "Family Member 6 Name";
    case "teacher_relname1":
      return "Relation Name";
    case "teacher_relname2":
      return "Relation 2 Name";
    case "teacher_relname3":
      return "Relation 3 Name";
    case "teacher_relname4":
      return "Relation 4 Name";
    case "teacher_relname5":
      return "Relation 5 Name";
    case "teacher_relname6":
      return "Relation 6 Name";
    case "teacher_fmlyage1":
      return "Family Member Age";
    case "teacher_fmlyage2":
      return "Family Member 2 Age";
    case "teacher_fmlyage3":
      return "Family Member 3 Age";
    case "teacher_fmlyage4":
      return "Family Member 4 Age";
    case "teacher_fmlyage5":
      return "Family Member 5 Age";
    case "teacher_fmlyage6":
      return "Family Member 6 Age";
    case "teacher_fmlyadhaar1":
      return "Family Member Adhaar";
    case "teacher_fmlyadhaar2":
      return "Family Member 2 Adhaar";
    case "teacher_fmlyadhaar3":
      return "Family Member 3 Adhaar";
    case "teacher_fmlyadhaar4":
      return "Family Member 4 Adhaar";
    case "teacher_fmlyadhaar5":
      return "Family Member 5 Adhaar";
    case "teacher_fmlyadhaar6":
      return "Family Member 6 Adhaar";
    case "teacher_1":
      return "Attribute 1";
    case "teacher_2":
      return "Attribute 2";
    case "teacher_3":
      return "Attribute 3";
    case "teacher_4":
      return "Attribute 4";
    case "teacher_5":
      return "Attribute 5";
    case "teacher_6":
      return "Attribute 6";
    case "teacher_salary_bank_map":
      return "Salary Bank Mapping";
    case "teacher_sal_match":
      return "Salary Match";
    case "teacher_hide_ateen":
      return "Hide Ateen";
    case "created_at":
      return "Created At";
    case "updated_at":
      return "Updated At";
    case "school":
      return "School";
    default:
      return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  }
};

export const getGender = () => {
  return [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Other", value: "Other" },
  ];
};

export const getMaritalStatus = () => {
  return [
    { label: "Married", value: "Married" },
    { label: "Unmarried", value: "Unmarried" },
  ];
};

export const getBloodGroups = () => {
  return [
    { label: "A+", value: "A+" },
    { label: "A-", value: "A-" },
    { label: "B+", value: "B+" },
    { label: "B-", value: "B-" },
    { label: "AB+", value: "AB+" },
    { label: "AB-", value: "AB-" },
    { label: "O+", value: "O+" },
    { label: "O-", value: "O-" },
  ];
};
