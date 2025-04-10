export function arrayString(valu) {
  let a = typeof valu;
  if (a == "object") {
    let error = {};
    for (const val of Object.entries(valu)) {
      const [key, value] = val;
      if (key != "status") {
        if (key === "detail" || key === "message" || key === "error") {
          error["message"] = value;
          return error;
        } else if (key !== "message" || key !== "non_field_errors") {
          error[key] = value[0];
        } else {
          error["message"] = value || value[0] || "Something went wrong";
        }
      }
    }
    return error;
  } else return valu;
}
export function objectToQueryString(obj) {
  const queryString = Object.keys(obj)
    .filter((key) => obj[key] !== null && obj[key] !== undefined && obj[key] !== "")
    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]))
    .join("&");

  return queryString ? "?" + queryString : "";
}
