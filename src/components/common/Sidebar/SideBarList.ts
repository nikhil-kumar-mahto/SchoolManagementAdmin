import {
  ClassIcon,
  DashboardIcon,
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
    href: "/dashboard",
    Icon: SchoolIcon2,
    fill: "#000",
  },
  {
    name: "Teacher Management",
    href: "/dashboard",
    Icon: TeacherIcon,
    stroke: "#000",
  },
  {
    name: "Subject Management",
    href: "/dashboard",
    Icon: SubjectIcon,
    fill: "#000",
  },
  {
    name: "Class Management",
    href: "/dashboard",
    Icon: ClassIcon,
    fill: "#000",
  },
];
