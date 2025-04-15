interface TimeSlot {
  startTime: string;
  endTime: string;
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
        startTime: "09:00",
        endTime: "09:45",
        teacher: "TCH001",
        subject: "Math",
      },
      {
        startTime: "09:45",
        endTime: "10:30",
        teacher: "TCH002",
        subject: "Science",
      },
      {
        startTime: "10:45",
        endTime: "11:30",
        teacher: "TCH003",
        subject: "English",
      },
    ],
    Tuesday: [
      {
        startTime: "09:00",
        endTime: "09:45",
        teacher: "TCH004",
        subject: "History",
      },
      {
        startTime: "09:45",
        endTime: "10:30",
        teacher: "TCH002",
        subject: "Science",
      },
      {
        startTime: "10:45",
        endTime: "11:30",
        teacher: "TCH005",
        subject: "Art",
      },
    ],
    Wednesday: [
      {
        startTime: "09:00",
        endTime: "09:45",
        teacher: "TCH001",
        subject: "Math",
      },
      {
        startTime: "09:45",
        endTime: "10:30",
        teacher: "TCH003",
        subject: "English",
      },
      {
        startTime: "10:45",
        endTime: "11:30",
        teacher: "TCH004",
        subject: "History",
      },
    ],
    Thursday: [
      {
        startTime: "09:00",
        endTime: "09:45",
        teacher: "TCH002",
        subject: "Science",
      },
      {
        startTime: "09:45",
        endTime: "10:30",
        teacher: "TCH005",
        subject: "Art",
      },
      {
        startTime: "10:45",
        endTime: "11:30",
        teacher: "TCH001",
        subject: "Math",
      },
    ],
    Friday: [
      {
        startTime: "09:00",
        endTime: "09:45",
        teacher: "TCH003",
        subject: "English",
      },
      {
        startTime: "09:45",
        endTime: "10:30",
        teacher: "TCH004",
        subject: "History",
      },
      {
        startTime: "10:45",
        endTime: "11:30",
        teacher: "TCH002",
        subject: "Science",
      },
    ],
  },
};
export default dummyScheduleData;
