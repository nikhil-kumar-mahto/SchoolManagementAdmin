import React, { useState } from "react";
import styles from "./DataTable.module.css";
import Loader from "../Loader/Loader";

interface DataTableProps<T> {
  data: T[];
  columns: {
    key: keyof T;
    header: string;
    render?: (item: T) => React.ReactNode;
  }[];
  itemsPerPage?: number;
  isLoading?: boolean;
}

const DataTable = <T extends {}>({
  data,
  columns,
  itemsPerPage = 5,
  isLoading = false,
}: DataTableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className={styles["table-container"]}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key as string}>{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} style={{ marginTop: "10px" }}>
                <div className="mt-4">
                  <Loader
                    text="Loading data..."
                    className="flex-center w-100"
                  />
                </div>
              </td>
            </tr>
          ) : currentItems.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ marginTop: "10px" }}>
                <div className="mt-4">
                  <p className="text-center">No records to display</p>
                </div>
              </td>
            </tr>
          ) : (
            currentItems.map((item, index) => (
              <tr key={index}>
                {columns.map((column) => (
                  <td key={column.key as string}>
                    {column.render
                      ? column.render(item)
                      : (item[column.key] as string)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {!isLoading && data?.length > itemsPerPage && (
        <div className={`${styles.pagination} mt-4`}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={currentPage === number ? styles.active : ""}
            >
              {number}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DataTable;
