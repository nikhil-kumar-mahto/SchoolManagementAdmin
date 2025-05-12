import React, { ChangeEvent, useState } from "react";
import Layout from "../../components/common/Layout/Layout";

import styles from "./Reports.module.css";
import Table from "../../components/reports/table/Table";
import Select from "../../components/common/Select/Select";
import { filterTypes } from "../../static/reports";
import Fetch from "../../utils/form-handling/fetch";
import DatePicker from "../../components/DatePicker/DatePicker";
import { useAppContext } from "../../contexts/AppContext";
import Button from "../../components/common/Button/Button";
import {
  generateColumns,
  generateColumnsForClass,
  generateRows,
  generateTableData,
} from "../../utils/reports/functions";
import Card from "../../components/reports/ card/Card";
import { convertMinutesToHoursAndMinutes } from "../../utils/common/utility-functions";
import moment from "moment";

const Reports: React.FC = () => {
  const [dataType, setDataType] = useState("Today");
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [data, setData] = useState<any>({});
  const [columns, setColumns] = useState<string[]>([]);
  const [rows, setRows] = useState<string[]>([]);
  const [tableData, setTableData] = useState<any>({});
  const [dateFilters, setDateFilters] = useState({
    startDate: "",
    endDate: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState<any>({});
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const [selectedFilter, setSelectedFilter] = useState({
    school: "",
    class: "",
    teacher: "",
  });

  const { schools } = useAppContext();

  const getTeachers = (id: string) => {
    setTeachers([]);
    Fetch(`list-teachers/${id}/?limit=40`).then((res: any) => {
      if (res.status) {
        let teachers = res.data?.results?.map(
          (item: { name: string; id: string }) => {
            return {
              label: item?.name,
              value: item?.id,
            };
          }
        );
        setTeachers(teachers);
      }
    });
  };

  const getData = () => {
    setIsLoading(true);
    Fetch(
      `admin/reports/?class_id=${selectedFilter.class}&teacher_id=${
        selectedFilter.teacher
      }&filter=${dataType.toLowerCase()}&start_date=${
        dateFilters?.startDate
      }&end_date=${dateFilters?.endDate}`
    ).then((res) => {
      setIsLoading(false);
      if (res.status) {
        setIsDataLoaded(true);
        setData(res?.data);
        let arr = [];
        // if (selectedFilter.class && !selectedFilter.teacher) {
        //   arr = generateColumnsForClass(res?.data?.data);
        // } else {
        //   arr = generateColumns(res?.data?.data);
        // }
        arr = generateColumns(res?.data?.data);

        let arr2 = generateRows(res?.data?.data);
        let tableData = generateTableData(res?.data?.data, arr);

        setTableData(tableData);
        setColumns(arr);
        setRows(arr2);
      }
    });
  };

  const handleChangeFilter = (
    type: "school" | "class" | "teacher",
    value: string
  ) => {
    setIsDataLoaded(false);
    if (type === "school") {
      getTeachers(value);
      let classes = schools
        ?.find((item) => item?.value === value)
        ?.classes?.map((item) => ({
          label: item?.name + " " + item?.section,
          value: item?.id,
        }));

      setClasses(classes);
    }

    setSelectedFilter((prevState) => ({
      ...prevState,
      [type]: value,
      ...(type === "school" && { class: "" }),
    }));
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
    setIsDataLoaded(false);
    setDataType(filter);
  };

  const validate = () => {
    setErr({});
    if (dataType === "Custom") {
      if (!dateFilters.startDate) {
        setErr((prevState: any) => {
          return {
            ...prevState,
            startDate: "Please select start date.",
          };
        });
      }
      if (!dateFilters.endDate) {
        setErr((prevState: any) => {
          return {
            ...prevState,
            endDate: "Please select end date.",
          };
        });
      }

      if (!dateFilters.startDate || !dateFilters.endDate) {
        return;
      }
      getData();
    } else {
      getData();
    }
  };

  return (
    <Layout>
      <div className={`${styles.container} mt-4`}>
        <div className={styles.reportsHeader}>
          <h2 className="my-3">Reports</h2>
          <Button
            text="Filter"
            onClick={validate}
            isLoading={isLoading}
            disabled={
              !(
                selectedFilter.school &&
                (selectedFilter.class || selectedFilter.teacher)
              )
            }
            style={{ width: "6rem" }}
          />
        </div>

        <div className={`${styles.filtersContainer} mb-2`}>
          <Select
            label="Select school"
            options={schools}
            value={selectedFilter?.school}
            onChange={(value: string) => handleChangeFilter("school", value)}
          />

          <Select
            label="Select class"
            options={classes}
            value={selectedFilter?.class}
            onChange={(value: string) => handleChangeFilter("class", value)}
          />

          <Select
            label="Select teacher"
            options={teachers}
            value={selectedFilter?.teacher}
            onChange={(value: string) => handleChangeFilter("teacher", value)}
          />
        </div>

        <div className={styles.datePickerContainer}>
          <Select
            label="Select Filter Type"
            options={filterTypes}
            value={dataType}
            onChange={(value: string) => handleDataTypeChange(value)}
          />

          <DatePicker
            label="Select start date"
            selectedDate={dateFilters.startDate}
            onDateChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleDateChange("startDate", e.target.value)
            }
            max={
              dateFilters.endDate
                ? dateFilters.endDate
                : moment().format("YYYY-MM-DD")
            }
            className="w-100"
            error={err?.startDate}
            visibility={dataType === "Custom"}
          />

          <DatePicker
            label="Select end date"
            selectedDate={dateFilters.endDate}
            onDateChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleDateChange("endDate", e.target.value)
            }
            min={dateFilters.startDate ? dateFilters.startDate : undefined}
            max={moment().format("YYYY-MM-DD")}
            className="w-100"
            error={err?.endDate}
            visibility={dataType === "Custom"}
          />
        </div>

        {isDataLoaded && data?.data && data?.data.length > 0 && (
          <h4 className="my-2">
            Detailed Report for
            {selectedFilter.class && !selectedFilter.teacher
              ? " Class"
              : " Teacher"}
          </h4>
        )}

        {isDataLoaded && data?.data && data?.data.length > 0 && (
          <div className={styles.cardContainer}>
            <Card
              data={{
                title: "Total Classes",
                value: data?.summary?.total_classes,
                description: "Classes attended",
              }}
            />
            <Card
              data={{
                title: "Total Overtime",
                value: convertMinutesToHoursAndMinutes(
                  data?.summary?.total_overtime_minutes
                ),
                description: "Extra time spent",
              }}
            />
            <Card
              data={{
                title: "Total Short Time",
                value: convertMinutesToHoursAndMinutes(
                  data?.summary?.total_short_time_minutes
                ),
                description: "Less time spent",
              }}
            />
            <Card
              data={{
                title: "Total Time Spent",
                value: convertMinutesToHoursAndMinutes(
                  data?.summary?.total_time_spent_minutes
                ),
                description: "Overall time spent",
              }}
            />
          </div>
        )}

        {!isDataLoaded && (
          <div className={styles.placeholder}>
            <p className={styles.message}>
              Please select class or teacher, then click 'Filter' to view the
              results.
            </p>
          </div>
        )}

        {isDataLoaded && (
          <Table
            columnHeaders={columns}
            rowHeaders={rows}
            data={tableData}
            showClassInfo={selectedFilter.class && !selectedFilter.teacher}
          />
        )}
      </div>
    </Layout>
  );
};

export default Reports;
