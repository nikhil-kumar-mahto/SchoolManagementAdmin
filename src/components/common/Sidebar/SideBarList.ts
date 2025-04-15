import {
  ClassIcon,
  DashboardIcon,
  ScheduleIcon,
  SchoolIcon2,
  SubjectIcon,
  TeacherIcon,
} from "../../../assets/svgs";

interface SidebarItem {
  name: string;
  href: string;
  Icon: React.FC<{ fill?: string; stroke?: string }>;
  fill?: string;
  stroke?: string;
}

export const sidebarItems: SidebarItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    Icon: DashboardIcon,
    fill: "#000",
  },
  {
    name: "School Management",
    href: "/schools",
    Icon: SchoolIcon2,
    fill: "#000",
  },
  {
    name: "Teacher Management",
    href: "/teachers",
    Icon: TeacherIcon,
    stroke: "#000",
  },
  {
    name: "Subject Management",
    href: "/subjects",
    Icon: SubjectIcon,
    fill: "#000",
  },
  {
    name: "Class Management",
    href: "/classes",
    Icon: ClassIcon,
    fill: "#000",
  },
  {
    name: "Schedule Management",
    href: "/schedule",
    Icon: ScheduleIcon,
    fill: "#000",
  },
];
