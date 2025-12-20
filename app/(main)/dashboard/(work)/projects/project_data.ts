import { Project } from "@/utils/workType";

export const projects: Project[] = [
  {
    id: "1",
    title: "Mobile App",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
    members: 4,
    status: "Due",
    endDate: "25/11/2025",
    tasks: [
      {
          id: "1",
          title: "Task 1",
          description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
          priority: "low",
          status: "Due",
          endDate: "25/11/2025",
      },
      {
          id: "2",
          title: "Task 2",
          description:
              "Sed ut perspiciatis unde omnis iste natus error sit voluptatem.",
          priority: "high",
          status: "In Progress",
          endDate: "10/01/2026",
      },
      {
          id: "3",
          title: "Task 4",
          description:
              "Sed ut perspiciatis unde omnis iste natus error sit voluptatem.",
          priority: "medium",
          status: "Up Comming",
          endDate: "10/01/2026",
      }, {
          id: "4",
          title: "Task 4",
          description:
              "Sed ut perspiciatis unde omnis iste natus error sit voluptatem.",
          priority: "high",
          status: "Done",
          endDate: "10/01/2026",
      },
  ]
  },
  {
    id: "2",
    title: "Web Platform",
    description:
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem.",
    members: 6,
    status: "In Progress",
    endDate: "10/01/2026",
  },
  {
    id: "3",
    title: "Report",
    description:
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem.",
    members: 2,
    status: "Up Comming",
    endDate: "10/01/2026",
  },{
    id: "4",
    title: "Research",
    description:
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem.",
    members: 4,
    status: "Done",
    endDate: "10/01/2026",
  },
];
