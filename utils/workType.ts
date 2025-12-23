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

export type ProjectAPIResponse = {
  proj_id: string;
  proj_name: string;
  description: string | null;

  startAt: string;
  endAt: string;
  createAt: string;
  updateAt: string;
};
