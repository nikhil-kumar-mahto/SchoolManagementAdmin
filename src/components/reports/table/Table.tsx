import React, { useState } from "react";
import styles from "./Table.module.css";
import ImagePreview from "../../common/ImagePreview/ImagePreview";
import { IconEye } from "../../../assets/svgs";
import moment from "moment";

interface TableProps {
  columnHeaders: string[];
  rowHeaders: string[];
  data: {
    time: string;
    records: {
      date: string;
      punchInTime: string;
      punchOutTime: string;
      late: string;
      early: string;
      punchInPhoto: string;
      punchOutPhoto: string;
      punchInReason: string;
      punchOutReason: string;
    }[];
  }[];
}

const Table: React.FC<TableProps> = ({ columnHeaders, rowHeaders, data }) => {
  const [photo, setPhoto] = useState({
    type: "",
    url: "",
  });
  if (Object.keys(data).length === 0) {
    return (
      <div className="flex-center py-2">
        <p className="error">No report data available.</p>
      </div>
    );
  }
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Timings / Dates</th>
            {columnHeaders.map((date) => (
              <th key={date}>{date}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rowHeaders.map((time) => (
            <tr key={time}>
              <td className={styles.timeColumn}>{time}</td>
              {columnHeaders.map((date, index) => {
                const record = data[time];

                return (
                  <td key={`${date}-${index}`} className={styles.cell}>
                    {record ? (
                      <>
                        <div className="py-2">
                          <strong>Punch In:</strong>{" "}
                          {record[index]?.in_time
                            ? moment(record[index]?.in_time, "HH:mm").format(
                                "HH:mm A"
                              )
                            : "N/A"}
                        </div>
                        <div className="py-2">
                          <strong>Punch Out:</strong>{" "}
                          {record?.[index]?.out_time
                            ? moment(record?.[index]?.out_time, "HH:mm").format(
                                "HH:mm A"
                              )
                            : "N/A"}
                        </div>
                        <div className="py-2">
                          <strong>Late:</strong>{" "}
                          {record[index]?.late?.late_punch_out
                            ? record[index]?.late?.late_punch_out + " mins."
                            : "N/A"}
                        </div>
                        <div className="py-2">
                          <strong>Early:</strong>{" "}
                          {record[index]?.early_punch_out
                            ? record[index]?.early_punch_out + " mins."
                            : "N/A"}
                        </div>
                        <div
                          className={`py-2 flex-center ${styles.photoContainer}`}
                        >
                          <strong>Punch In Photo:</strong>
                          {record[index]?.punch_in_photo ? (
                            <button
                              type="button"
                              className={styles.button}
                              onClick={() =>
                                setPhoto({
                                  type: "PUNCH_IN",
                                  url: record[index]?.punch_in_photo,
                                })
                              }
                            >
                              <IconEye color="#007bff" />
                            </button>
                          ) : (
                            "N/A"
                          )}
                        </div>
                        <div
                          className={`py-2 flex-center ${styles.photoContainer}`}
                        >
                          <strong>Punch Out Photo:</strong>{" "}
                          {record[index]?.punch_out_photo ? (
                            <button
                              type="button"
                              className={styles.button}
                              onClick={() =>
                                setPhoto({
                                  type: "PUNCH_OUT",
                                  url: record[index]?.punch_out_photo,
                                })
                              }
                            >
                              <IconEye color="#007bff" />
                            </button>
                          ) : (
                            "N/A"
                          )}
                        </div>
                        <div className="py-2">
                          <strong>Punch In Reason:</strong>{" "}
                          {/* {record[index]?.early_reason
                            ? record[index]?.early_reason?.slice(0, 15).trim() +
                              "..."
                            : "N/A"} */}
                          {record[index]?.early_reason || "N/A"}
                        </div>
                        <div className="py-2">
                          <strong>Punch Out Reason:</strong>{" "}
                          {/* {record[index]?.late_reason
                            ? record[index].late_reason.slice(0, 15).trim() +
                              "..."
                            : "N/A"} */}
                          {record[index]?.late_reason || "N/A"}
                        </div>
                      </>
                    ) : (
                      "No Data"
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {photo?.type && (
        <ImagePreview
          text={`Punch ${photo.type === "PUNCH_IN" ? "In" : "Out"} Photo`}
          imageUrl={photo.url}
          onClose={() => setPhoto({ type: "", url: "" })}
        />
      )}
    </div>
  );
};

export default Table;
