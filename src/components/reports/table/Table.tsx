import React from "react";
import styles from "./Table.module.css";

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
  if (Object.keys(data).length === 0) {
    return (
      <div className="flex-center py-2">
        <p className="error">No records available.</p>
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
                  <td key={`${date}-${time}`} className={styles.cell}>
                    {record ? (
                      <>
                        <div className="py-2">
                          <strong>Punch In:</strong>{" "}
                          {record[index]?.in_time || "N/A"}
                        </div>
                        <div className="py-2">
                          <strong>Punch Out:</strong>{" "}
                          {record?.[index]?.out_time || "N/A"}
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
                        <div className="py-2">
                          <strong>Punch In Photo:</strong>{" "}
                          {record[index].punch_in_photo ? (
                            <img
                              src={record[index]?.punch_in_photo}
                              alt="Punch In"
                              className={styles.photo}
                            />
                          ) : (
                            "N/A"
                          )}
                        </div>
                        <div className="py-2">
                          <strong>Punch Out Photo:</strong>{" "}
                          {record[index].punch_out_photo ? (
                            <img
                              src={record[index]?.punch_out_photo}
                              alt="Punch Out"
                              className={styles.photo}
                            />
                          ) : (
                            "N/A"
                          )}
                        </div>
                        <div className="py-2">
                          <strong>Punch In Reason:</strong>{" "}
                          {record[index]?.early_reason
                            ? record?.early_reason?.slice(0, 15).trim() + "..."
                            : "N/A"}
                        </div>
                        <div className="py-2">
                          <strong>Punch Out Reason:</strong>{" "}
                          {record[index]?.late_reason
                            ? record?.late_reason?.slice(0, 15).trim() + "..."
                            : "N/A"}
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
    </div>
  );
};

export default Table;
