import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { X } from "lucide-react-native";
import { Pressable } from "react-native";

type Props = {
  title: string;
  description: string;
  onClose?: () => void;
};

export default function IssueCard({ title, description, onClose }: Props) {
  return (
    <Box
      className="rounded-2xl p-4 mb-4 mx-6"
      style={{
        backgroundColor: "#FFFFFF",

        // iOS
        shadowColor: "#000",
        shadowOffset: { width: 2, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 6,

        // Android
        elevation: 3,
      }}
    >
      <HStack className="justify-between items-start">
        <Box>
          <Text className="text-base font-semibold">
            {title}
          </Text>

          <Text className="text-sm mt-1 text-gray-600">
            {description}
          </Text>
        </Box>

        <Pressable onPress={onClose}>
          <X size={20} color="#000" />
        </Pressable>
      </HStack>
    </Box>
  );
}
