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
  "In Progress": {
    bg: Colors.card.in_progress,
    text: Colors.light.text_primary,
    iconColor: Colors.light.text_primary,
    icon: Play,
  },
  "UpComming": {
    bg: Colors.card.up_comming,
    text: Colors.light.text_primary,
    iconColor: Colors.light.text_primary,
    icon: Clock,
  },
  "Done": {
    bg: Colors.card.done,
    text: Colors.light.text_primary,
    iconColor: Colors.light.text_primary,
    icon: Check,
  },
  "Due": {
    bg: Colors.card.due,
    text: Colors.light.text_primary,
    iconColor: Colors.light.text_primary,
    icon: X,
  },
};
