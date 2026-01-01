import { Colors } from "@/constants/theme";
import { Check, Clock, Play, X } from "lucide-react-native";

export const priorityStyles: Record<string, { bg: string; text: string }> = {
    high: {
        bg: 'bg-[#FEF3C7]',
        text: 'text-[#DA9509]',
    },
    medium: {
        bg: 'bg-[#E6F0FA]',
        text: 'text-[#4FC3F7]',
    },
    low: {
        bg: 'bg-[#C7FFDA]',
        text: 'text-[#42FD81]',
    },
};

export const TASK_STATUS_STYLE: Record<
    string,
    {
        bg: string;
        text: string;
        iconColor: string;
        icon: React.ElementType;
    }
> = {
    "OPEN": {
        bg: Colors.card.in_progress,
        text: Colors.light.text_primary,
        iconColor: Colors.light.text_primary,
        icon: Play,
    },
    "PROGRESS": {
        bg: Colors.card.up_comming,
        text: Colors.light.text_primary,
        iconColor: Colors.light.text_primary,
        icon: Clock,
    },
    "DONE": {
        bg: Colors.card.done,
        text: Colors.light.text_primary,
        iconColor: Colors.light.text_primary,
        icon: Check,
    },
    "REOPEN": {
        bg: Colors.card.due,
        text: Colors.light.text_primary,
        iconColor: Colors.light.text_primary,
        icon: Play,
    },
    "CLOSE": {
        bg: Colors.card.due,
        text: Colors.light.text_primary,
        iconColor: Colors.light.text_primary,
        icon: X,
    },
};

export type TaskStatus =
    | "open"
    | "progress"
    | "done"
    | "reopen"
    | "close"
    | "";



export type TaskPriority = "low" | "medium" | "high" | "";