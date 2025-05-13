
export type ReportData = {
  class_info: {
    id: string;
    name: string;
    section: string;
  };
  time_spent: number;
  absent_reason: '';
  early_reason: '';
  in_time: '';
  date: '';
  late_minutes: '';
  late_reason: '';
  out_time: '';
  punch_in_photo: '';
  punch_out_photo: '';
  status: '';
  time_slot: {
    class_info: {
      id: string;
      name: string;
      section: string;
    };
    end_time: string;
    id: string;
    start_time: string;
    status: string;
    subject: {
      id: string;
      name: string;
    };
    teacher: {
      id: string;
      name: string;
    };
  };
  late: {
    late_punch_in: string;
    late_punch_out: string;
  };
  early_punch_out: string;
};

export type ReportSummary = {
  total_classes: number;
  total_overtime_minutes: number;
  total_short_time_minutes: number;
  total_time_spent_minutes: number;
};

export type ReportTypes = {
  data: ReportData[];
  summary: ReportSummary;
};
