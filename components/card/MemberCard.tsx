import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Colors } from "@/constants/theme";
import { UserRound, X } from "lucide-react-native";
import { Pressable } from "react-native";

type Props = {
    id: string;
    name: string;
    onRemove?: (id: string) => void;
};

export default function MemberCard({name, id, onRemove}: Props) {

return (
    <Box
        className="h-[56px] flex-row items-center justify-between bg-white mb-3 rounded-xl"
        style={{
            // iOS
            shadowColor: "#000",
            shadowOffset: { width: 5, height: 5 },
            shadowOpacity: 0.15,
            shadowRadius: 3,

            // Android shadow
            elevation: 3,
        }}
    >
        <HStack space="md" className="items-center flex-1">
            <Box className="h-[56px] w-[56px] rounded-l-lg items-center justify-center bg-inputBorder">
                <UserRound size={38} color={Colors.light.primary} />
            </Box>

            <Text className="text-lg font-medium text-darkTextPrimary">
                {name}
            </Text>
        </HStack>

        <Pressable className="pr-4" onPress={() => onRemove?.(id)}>
            <X size={24} color={Colors.light.primary} />
        </Pressable>
    </Box>
);
}
