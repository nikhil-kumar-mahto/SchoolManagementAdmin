import { useState } from "react";
import styles from "./DataTable.module.css";
import { dummyData } from "../../../static/data.js";

const DataTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = dummyData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(dummyData.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className={`styles["table-container"]`}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>City</th>
            <th>Country</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item: any) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.email}</td>
              <td>{item.city}</td>
              <td>{item.country}</td>
            </tr>
          ))}
        </tbody>
      </table>

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
    </div>
  );
};

export default DataTable;
