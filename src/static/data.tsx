interface TimeSlot {
  start_time: string;
  end_time: string;
  teacher: string;
  subject: string;
}

interface DayTimeSlots {
  Monday: TimeSlot[];
  Tuesday: TimeSlot[];
  Wednesday: TimeSlot[];
  Thursday: TimeSlot[];
  Friday: TimeSlot[];
  [key: string]: TimeSlot[];
}

export interface ScheduleItem {
  school: string;
  class: string;
  "day-time-slots": DayTimeSlots;
}

const dummyScheduleData: ScheduleItem = {
  school: "SCH001",
  class: "CLS05A",
  "day-time-slots": {
    Monday: [
      {
        start_time: "09:00",
        end_time: "09:45",
        teacher: "TCH001",
        subject: "Math",
      },
      {
        start_time: "09:45",
        end_time: "10:30",
        teacher: "TCH002",
        subject: "Science",
      },
      {
        start_time: "10:45",
        end_time: "11:30",
        teacher: "TCH003",
        subject: "English",
      },
    ],
    Tuesday: [
      {
        start_time: "09:00",
        end_time: "09:45",
        teacher: "TCH004",
        subject: "History",
      },
      {
        start_time: "09:45",
        end_time: "10:30",
        teacher: "TCH002",
        subject: "Science",
      },
      {
        start_time: "10:45",
        end_time: "11:30",
        teacher: "TCH005",
        subject: "Art",
      },
    ],
    Wednesday: [
      {
        start_time: "09:00",
        end_time: "09:45",
        teacher: "TCH001",
        subject: "Math",
      },
      {
        start_time: "09:45",
        end_time: "10:30",
        teacher: "TCH003",
        subject: "English",
      },
      {
        start_time: "10:45",
        end_time: "11:30",
        teacher: "TCH004",
        subject: "History",
      },
    ],
    Thursday: [
      {
        start_time: "09:00",
        end_time: "09:45",
        teacher: "TCH002",
        subject: "Science",
      },
      {
        start_time: "09:45",
        end_time: "10:30",
        teacher: "TCH005",
        subject: "Art",
      },
      {
        start_time: "10:45",
        end_time: "11:30",
        teacher: "TCH001",
        subject: "Math",
      },
    ],
    Friday: [
      {
        start_time: "09:00",
        end_time: "09:45",
        teacher: "TCH003",
        subject: "English",
      },
      {
        start_time: "09:45",
        end_time: "10:30",
        teacher: "TCH004",
        subject: "History",
      },
      {
        start_time: "10:45",
        end_time: "11:30",
        teacher: "TCH002",
        subject: "Science",
      },
    ],
  },
};
export default dummyScheduleData;
