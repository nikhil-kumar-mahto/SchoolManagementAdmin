import React, { ChangeEvent, useState } from "react";
import Layout from "../../components/common/Layout/Layout";

import styles from "./Reports.module.css";
import Filters from "../../components/reports/filter-button/FilterButton";
import Table from "../../components/reports/table/Table";
import Select from "../../components/common/Select/Select";
import {
  columnHeaders,
  filterTypes,
  rowHeaders,
  tableData,
} from "../../static/reports";
import Fetch from "../../utils/form-handling/fetch";
import DatePicker from "../../components/DatePicker/DatePicker";

const Reports: React.FC = () => {
  const [dataType, setDataType] = useState("Today");
  const [data, setData] = useState([]);
  const [dateFilters, setDateFilters] = useState({
    startDate: "",
    endDate: "",
  });

  const [selectedFilter, setSelectedFilter] = useState({
    school: "",
    class: "",
    teacher: "",
  });

  const getData = () => {
    Fetch(
      `/apiurl?school=${selectedFilter.school}&class=${selectedFilter.class}&teacher=${selectedFilter.teacher}`
    ).then((res) => {
      if (res.status) {
        setData(res?.data);
      }
    });
  };

  const handleChangeFilter = (
    type: "school" | "class" | "teacher",
    value: string
  ) => {
    setSelectedFilter((prevState) => {
      return {
        ...prevState,
        [type]: value,
      };
    });
  };

  const handleDateChange = (type: "startDate" | "endDate", value: string) => {
    setDateFilters((prevState) => {
      return {
        ...prevState,
        [type]: value,
      };
    });
  };

  const handleDataTypeChange = (filter: string) => {
    setDataType(filter);
  };

  return (
    <Layout>
      <div className={styles.container}>
        <h2 className="my-3">Reports</h2>
        <div className={`${styles.filtersContainer} mb-2`}>
          <Select
            label="Select school"
            options={[]}
            value={selectedFilter?.school}
            onChange={(value: string) => handleChangeFilter("school", value)}
          />

          <Select
            label="Select class"
            options={[]}
            value={selectedFilter?.class}
            onChange={(value: string) => handleChangeFilter("class", value)}
          />

          <Select
            label="Select teacher"
            options={[]}
            value={selectedFilter?.teacher}
            onChange={(value: string) => handleChangeFilter("teacher", value)}
          />
        </div>
        {/* <Filters
          selectedFilter={dataType}
          onFilterChange={handleDataTypeChange}
        /> */}

        <div className={styles.datePickerContainer}>
          <Select
            label="Select Filter Type"
            options={filterTypes}
            value={dataType}
            onChange={(value: string) => handleDataTypeChange(value)}
          />
          {dataType === "Custom" && (
            <>
              <DatePicker
                label="Select start date"
                selectedDate={dateFilters.startDate}
                onDateChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleDateChange("startDate", e.target.value)
                }
                max={dateFilters.endDate ? dateFilters.endDate : undefined}
                className="w-100"
              />

              <DatePicker
                label="Select end date"
                selectedDate={dateFilters.endDate}
                onDateChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleDateChange("endDate", e.target.value)
                }
                min={dateFilters.startDate ? dateFilters.startDate : undefined}
                className="w-100"
              />
            </>
          )}
        </div>

        <Table
          columnHeaders={columnHeaders}
          rowHeaders={rowHeaders}
          data={tableData}
        />
      </div>
    </Layout>
  );
};

export default Reports;
