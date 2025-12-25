import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Trash2, Users } from "lucide-react-native";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";

import { PROJECT_STATUS_STYLE } from "@/utils/projectStatus";
import { useState } from "react";
import { Pressable } from "react-native";
import DeleteProject from "../popup/DeleteProject";

type Props = {
  title: string;
  description: string | null;
  members: number;
  status: string;
  endDate: string;
  onDelete?: () => void;
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const renderRightActions = () =>
    {
      return (
        <>
          <Pressable
            onPress={() => setShowDeleteModal(true)}
            className="bg-red-500 justify-center items-center w-20 mb-4 -ml-8 mr-6 rounded-r-2xl"
          >
            <Trash2 size={20} color="white" />
            <Text className="text-white text-xs mt-1">Delete</Text>
          </Pressable>
          <DeleteProject showDeleteModal={showDeleteModal} setShowDeleteModal={setShowDeleteModal} title={title}></DeleteProject>
        </>
      );
    };

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      overshootRight={false}
    >
      <Box
        className="rounded-2xl p-4 mb-4 mx-6 shadow-sm"
        style={{
          backgroundColor: style.bg,
          // iOS
          shadowColor: "#000",
          shadowOffset: { width: 5, height: 5 },
          shadowOpacity: 0.15,
          shadowRadius: 3,

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
    </Swipeable>

  );
}
