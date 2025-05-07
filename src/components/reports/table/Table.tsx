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
              {columnHeaders.map((date) => {
                const record = data
                  .find((d) => d.time === time)
                  ?.records.find((r) => r.date === date);

                return (
                  <td key={`${date}-${time}`} className={styles.cell}>
                    {record ? (
                      <>
                        <div className="py-2">
                          <strong>Punch In:</strong>{" "}
                          {record.punchInTime || "N/A"}
                        </div>
                        <div className="py-2">
                          <strong>Punch Out:</strong>{" "}
                          {record.punchOutTime || "N/A"}
                        </div>
                        <div className="py-2">
                          <strong>Late:</strong> {record.late || "N/A"}
                        </div>
                        <div className="py-2">
                          <strong>Early:</strong> {record.early || "N/A"}
                        </div>
                        <div className="py-2">
                          <strong>Punch In Photo:</strong>{" "}
                          {record.punchInPhoto ? (
                            <img
                              src={record.punchInPhoto}
                              alt="Punch In"
                              className={styles.photo}
                            />
                          ) : (
                            "N/A"
                          )}
                        </div>
                        <div className="py-2">
                          <strong>Punch Out Photo:</strong>{" "}
                          {record.punchOutPhoto ? (
                            <img
                              src={record.punchOutPhoto}
                              alt="Punch Out"
                              className={styles.photo}
                            />
                          ) : (
                            "N/A"
                          )}
                        </div>
                        <div className="py-2">
                          <strong>Punch In Reason:</strong>{" "}
                          {record.punchInReason
                            ? record.punchInReason.slice(0, 15).trim() + "..."
                            : "N/A"}
                        </div>
                        <div className="py-2">
                          <strong>Punch Out Reason:</strong>{" "}
                          {record.punchOutReason
                            ? record.punchOutReason.slice(0, 15).trim() + "..."
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
