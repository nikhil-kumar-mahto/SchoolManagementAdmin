/* eslint-disable */
// @ts-nocheck


import React from "react";
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
  currentPage?: number;
  totalRecords?: number;
  onPageChange?: (pageNumber: number) => void;
  isLoading?: boolean;
}

const DataTable = <T extends {}>({
  data,
  columns,
  itemsPerPage = 5,
  currentPage = 1,
  totalRecords = 0,
  onPageChange,
  isLoading = false,
}: DataTableProps<T>) => {
  const totalPages = Math.ceil(totalRecords / itemsPerPage);

  return (
    <div className={styles["table-container"]}>
      <div className={styles["table-wrapper"]}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={String(column.key)}>{column.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length}>
                  <div className={styles.loaderWrapper}>
                    <Loader />
                  </div>
                </td>
              </tr>
            ) : data.length > 0 ? (
              data.map((item, index) => (
                <tr key={index}>
                  {columns.map((column) => (
                    <td key={String(column.key)}>
                      {column.render
                        ? column.render(item)
                        : (item[column.key] as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!isLoading && totalPages > 1 && (
        <div className={`${styles.pagination} mt-4`}>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => onPageChange?.(pageNumber)}
                className={`${styles.pageButton} ${
                  currentPage === pageNumber ? styles.active : ""
                }`}
              >
                {pageNumber}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default DataTable;
