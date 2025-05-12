import moment from "moment";
import { ReportData } from "../../types/reports";

export const generateColumns = (data: ReportData[]): string[] => {
  let uniqueSet: Set<string> = new Set();

  data.map((item) => {
    let convertedFormat = `${moment(
      item?.time_slot?.start_time,
      "HH:mm"
    ).format("hh:mm A")} - ${moment(item?.time_slot?.end_time, "HH:mm").format(
      "hh:mm A"
    )}`;

    uniqueSet.add(convertedFormat);
  });

  return Array.from(uniqueSet);
};

export const generateRows = (data: ReportData[]): string[] => {
  const dateSet = new Set<string>();

  data.forEach((item) => {
    if (item?.date) {
      dateSet.add(item.date);
    }
  });

  return Array.from(dateSet);
};

export const generateTableData = (data: ReportData[], arr: string[]) => {
  const obj: Record<string, any[]> = {};

  data.forEach((item) => {
    const key = item?.date;
    if (!key) return;

    if (!obj[key]) {
      obj[key] = new Array(arr.length).fill(null);
    }

    let convertedFormat =
      moment(item?.time_slot?.start_time, "HH:mm").format("hh:mm A") +
      " - " +
      moment(item?.time_slot?.end_time, "HH:mm").format("hh:mm A");

    const index = arr.indexOf(convertedFormat);
    if (index !== -1) {
      obj[key][index] = item;
    }
  });

  return obj;
};

export const generateColumnsForClass = (data: ReportData[]): string[] => {
  const columnSet = new Set<string>();

  data?.forEach((item) => {
    const className = item?.time_slot?.class_info?.name || "";
    const section = item?.time_slot?.class_info?.section || "";
    const columnName = className + " " + section;

    if (columnName) {
      columnSet.add(columnName);
    }
  });

  return Array.from(columnSet);
};
