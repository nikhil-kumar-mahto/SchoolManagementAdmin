import moment from "moment";
import { ReportData } from "../../types/reports";

export const generateColumns = (data: ReportData[]): string[] => {
  let arr: string[] = [];

  data.map((item) => {
    let convertedFormat = `${moment(
      item?.time_slot?.start_time,
      "HH:mm"
    ).format("hh:mm A")} - ${moment(item?.time_slot?.end_time, "HH:mm").format(
      "hh:mm A"
    )}`;
    arr.push(convertedFormat);
  });

  return arr;
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

export const generateTableData = (data: ReportData[]) => {
  const obj: Record<string, any[]> = {};

  data.forEach((item) => {
    const key = item?.date;
    if (!key) return;

    if (!obj[key]) {
      obj[key] = [];
    }

    obj[key].push(item);
  });

  return obj;
};

export const generateColumnsForClass = (data: ReportData[]): string[] => {
  const columnSet = new Set<string>();

  data?.forEach((item) => {
    const className = item?.time_slot?.class_info?.name || "";
    const section = item?.time_slot?.class_info?.section || "";
    const columnName = className + section;

    if (columnName) {
      columnSet.add(columnName);
    }
  });

  return Array.from(columnSet);
};