export type NotificationType = {
    noti_id: string;
    title: string;
    content: string;
    createdAt: string;
    notifyAt: string;
    notifyType: NotifyType;
}

export type NotifyType =
    | "add_project"
    | "system"
    | "other"
    | "assign_task"
    | "upcoming_task"
    | "due_task"
    | "issue";