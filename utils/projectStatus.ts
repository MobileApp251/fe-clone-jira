import { Colors } from "@/constants/theme";
import { Check, Clock, Play, X } from "lucide-react-native";

export const PROJECT_STATUS_STYLE: Record<
    string,
    {
        bg: string;
        text: string;
        iconColor: string; 
        icon: React.ElementType;
    }
    > = {
    "IN_PROGRESS": {
        bg: Colors.card.in_progress,
        text: Colors.light.text_primary,
        iconColor: Colors.light.text_primary,
        icon: Play,
    },
    "UP_COMING": {
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
    "DUE": {
        bg: Colors.card.due,
        text: Colors.light.text_primary,
        iconColor: Colors.light.text_primary,
        icon: X,
    },
};

export type ProjectStatus =
    | "UP_COMING"
    | "IN_PROGRESS"
    | "DUE"
    | "DONE";

type GetStatusParams = {
    startAt: string;
    endAt: string;
    isDone?: boolean;
};

export function getProjectStatus({
    startAt,
    endAt,
    isDone = false,
}: GetStatusParams): ProjectStatus {
    if (isDone) return "DONE";

    const now = new Date();
    const start = new Date(startAt);
    const end = new Date(endAt);

    if (now < start) {
        return "UP_COMING";
    }

    if (now >= start && now < end) {
        return "IN_PROGRESS";
    }

    return "DUE";
}
