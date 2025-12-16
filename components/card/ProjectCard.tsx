import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Users } from "lucide-react-native";

import { PROJECT_STATUS_STYLE } from "@/utils/projectStatus";

type Props = {
    title: string;
    description: string;
    members: number;
    status: string;
    endDate: string;
};

export default function ProjectCard({
  title,
  description,
  members,
  status,
  endDate,
}: Props) {
  const style =
    PROJECT_STATUS_STYLE[status] ??
    PROJECT_STATUS_STYLE["Pending"];

  const StatusIcon = style.icon;

  return (
    <Box
      className="rounded-2xl p-4 mb-4 shadow-sm"
      style={{ 
        backgroundColor: style.bg,
        // iOS
        shadowColor: "#000",
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 8,

        // Android shadow
        elevation: 3,
       }}
    >
      <HStack className="justify-between items-center">
        <Text className="text-lg font-semibold" style={{ color: style.text }}>
          {title}
        </Text>

        <HStack space="xs" className="items-center">
          <Users size={18} color={style.iconColor} />
          <Text className="font-medium" style={{ color: style.text }}>
            {members}
          </Text>
        </HStack>
      </HStack>

      <Text
        className="text-sm mt-2 leading-5"
        style={{ color: style.text }}
      >
        {description}
      </Text>

      <Box className="h-[1px] bg-gray-300 my-3" />

      <HStack className="justify-between items-center">
        <HStack space="sm" className="items-center">
          <StatusIcon size={16} color={style.iconColor} />
          <Text className="text-sm font-medium" style={{ color: style.text }}>
            {status}
          </Text>
        </HStack>

        <Text className="text-sm text-darkTextPrimary">
          End date: {endDate}
        </Text>
      </HStack>
    </Box>
  );
}
