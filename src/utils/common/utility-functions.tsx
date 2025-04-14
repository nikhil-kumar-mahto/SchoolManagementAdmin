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
    case "email":
      return "Email Address";
    case "phone":
      return "Phone Number";
    case "school_id":
      return "School ID";
    case "branch_id":
      return "Branch ID";
    case "teacher_code":
      return "Teacher Code";
    case "teacher_adt_reg_no":
      return "Registration Number";
    case "card_number":
      return "Card Number";
    case "first_name":
      return "First Name";
    case "last_name":
      return "Last Name";
    case "gender":
      return "Gender";
    case "emergency_number":
      return "Emergency Contact Number";
    case "emergency_name":
      return "Emergency Contact Name";
    case "marital_status":
      return "Marital Status";
    case "blood_group":
      return "Blood Group";
    case "nominee":
      return "Nominee";
    case "nominee_relation":
      return "Nominee Relation";
    case "location":
      return "Location";
    case "location_category":
      return "Location Category";
    case "organizational_classification":
      return "Organizational Classification";
    case "organizational_category":
      return "Organizational Category";
    case "department_code":
      return "Department Code";
    case "department_head":
      return "Department Head";
    case "immediate_reporting":
      return "Immediate Reporting";
    case "teacher_SRA":
      return "SRA";
    case "category_type":
      return "Category Type";
    case "address1":
      return "Address Line 1";
    case "address2":
      return "Address Line 2";
    case "city":
      return "City";
    case "state":
      return "State";
    case "permanent_address":
      return "Permanent Address";
    case "branch":
      return "Branch";
    case "date_of_birth":
      return "Date of Birth";
    case "date_joining":
      return "Date of Joining";
    case "date_of_leaving":
      return "Date of Leaving";
    case "reason":
      return "Reason";
    case "teacher_cofirm":
      return "Confirmation";
    case "date_of_retirement":
      return "Date of Retirement";
    case "department":
      return "Department";
    case "designation":
      return "Designation";
    case "grade":
      return "Grade";
    case "teacher_adhoc":
      return "Adhoc";
    case "adhaar":
      return "Adhaar Number";
    case "pancard":
      return "PAN";
    case "bank_name":
      return "Bank Name";
    case "bank_account_number":
      return "Bank Account Number";
    case "bank_ifsc_code":
      return "Bank IFSC Code";
    case "teacher_disp":
      return "Dispensation";
    case "pension_amount":
      return "Pension Amount";
    case "voluntary_provident_fund":
      return "Voluntary Provident Fund (VPF)";
    case "universal_account_number":
      return "Universal Account Number (UAN)";
    case "gov_provident_fund":
      return "Government Provident Fund";
    case "gov_provided_fund_number":
      return "Government Provident Fund Number";
    case "file_passbook":
      return "Passbook File";
    case "file_adhaar":
      return "Adhaar File";
    case "file_pancard":
      return "Pancard File";
    case "form_11":
      return "Form 11";
    case "academic_qualification":
      return "Academic Qualification";
    case "academic_university":
      return "University";
    case "specialization":
      return "Specialization";
    case "passing_year":
      return "Passing Year";
    case "last_school":
      return "Last School";
    case "last_designation":
      return "Last Designation";
    case "last_date_of_leaving":
      return "Last Date of Leaving";
    case "reference":
      return "Reference";
    case "family_name1":
      return "Family Member Name";
    case "relation_name1":
      return "Relation Name";
    case "family_age1":
      return "Family Member Age";
    case "family_adhaar1":
      return "Family Member Adhaar";
    case "status":
      return "Status";
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

export const getCategory = () => {
  return [
    { label: "Full-Time", value: "FT" },
    { label: "Part-Time", value: "PT" },
    { label: "Contract", value: "CT" },
    { label: "Ad-Hoc", value: "AD" },
    { label: "Guest Faculty", value: "GT" },
    { label: "Temporary", value: "TM" },
    { label: "Other", value: "OT" },
  ];
};

export const getStatuses = () => {
  return [
    { label: "Active", value: "ACTIVE" },
    { label: "Probation", value: "PROB" },
    { label: "Resigned", value: "RESIGNED" },
    { label: "Retired", value: "RETIRED" },
    { label: "Terminated", value: "TERMINATED" },
  ];
};
