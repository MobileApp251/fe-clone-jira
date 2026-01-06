import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Colors } from "@/constants/theme";
import { Check, UserRound, X } from "lucide-react-native";
import { useState } from "react";
import { Pressable } from "react-native";
import RemoveMember from "../popup/RemoveMember";

type Props = {
    id: string;
    name: string;
    onRemove?: (id: string) => void;
    onSelected?: (id: string) => void;
    selected?: boolean;
    role?: string;
};

export default function MemberCard({ name, id, onRemove, onSelected, selected = false, role = "" }: Props) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);


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

                <Box className="flex-1">
                    <Text
                        className="text-lg font-medium text-darkTextPrimary"
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {name}
                    </Text>
                    {role.length > 0 &&
                        <Text
                            className="text-sm text-gray-500 mt-1"
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                        </Text>
                    }
                </Box>
            </HStack>

            {onSelected ? (
                <Pressable
                    className="pr-4"
                    onPress={() => onSelected(id)}
                >
                    <Box
                        className="w-6 h-6 rounded-md items-center justify-center"
                        style={{
                            borderWidth: 2,
                            borderColor: Colors.light.primary,
                            backgroundColor: selected
                                ? Colors.light.primary
                                : "transparent",
                        }}
                    >
                        {selected && (
                            <Check size={16} color="white" />
                        )}
                    </Box>
                </Pressable>
            ) : (
                <Pressable
                    className="pr-4"
                    onPress={() => setShowDeleteModal(true)}
                >
                    <X size={24} color={Colors.light.primary} />
                </Pressable>
            )}
            <RemoveMember
                showDeleteModal={showDeleteModal}
                setShowDeleteModal={setShowDeleteModal}
                userEmail={name}
                uid={id}
            ></RemoveMember>
        </Box>
    );
}
