import { TaskPriority, TaskStatus } from "./taskStatus";

export type Task = {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  status: string;
  endDate: string;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  members: number;
  status: string;
  endDate: string;
  tasks?: Task[];
};

export type ProjectData = {
  proj_id: string;
  proj_name: string;
  description: string | null;
  startAt: string;
  endAt: string;
  createAt: string;
  updateAt: string;
  done: boolean;
};

export type ProjectMembers = {
  email: string;
  role: string;
  uid: string;
  username: string;
}

export type ProjectByIdAPIResponse = {
  members: ProjectMembers[];
  project: ProjectData;
}

export type CreateProjectDTO = {
  description: string;
  endAt: string;
  proj_name: string;
  startAt: string;
}

export type TaskAPIResponse = {
  content: string;
  createAt: Date;
  endAt: Date;
  proj_id: string;
  startAt: string;
  status: TaskStatus;
  task_id: string;
  task_name: string;
  updateAt: Date;
  priority: TaskPriority,
}

export type CreateTaskDTO = {
  task_name: string;
  content: string;
  priority: "high" | "medium" | "low";
  status: string;
  startAt: string;
  endAt: string;
}