import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Colors } from "@/constants/theme";
import { ProjectMembers } from "@/utils/workType";
import { Check, X } from "lucide-react-native";
import { useState } from "react";
import { Pressable } from "react-native";
import UnassignTask from "../popup/UnassignTask";
import { Avatar, AvatarFallbackText } from "../ui/avatar";
import { Heading } from "../ui/heading";
import { VStack } from "../ui/vstack";

type Props = {
    name: string;
    uid: string;
    onSelected?: (id: string) => void;
    selected?: boolean;
    taskId: string;
    projectId: string;
    setMembers?: React.Dispatch<React.SetStateAction<ProjectMembers[]>>;
};

export default function AssigneeCard({
    name,
    uid,
    onSelected,
    selected,
    taskId,
    projectId,
    setMembers
}: Props) {

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    return (
        <Box
            className="rounded-2xl p-4 mx-6 mb-4 shadow-sm"
            style={{
                backgroundColor: "#F5F7FA",
                // iOS
                shadowColor: "#000",
                shadowOffset: { width: 5, height: 5 },
                shadowOpacity: 0.15,
                shadowRadius: 3,

                // Android shadow
                elevation: 3,
            }}
        >
            <VStack space="2xl">
                <HStack className="items-center" space="lg">
                    <Avatar className="bg-lightPrimary">
                        <AvatarFallbackText className="text-white">
                            {name}
                        </AvatarFallbackText>
                    </Avatar>
                    <Heading className="text-darkTextPrimary" size="sm">{name}</Heading>
                    {onSelected ? (
                        <Pressable
                            testID="assignee-checkbox"
                            className="pr-4 ml-auto"
                            onPress={() => onSelected(uid)}
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
                            testID="assignee-delete-button"
                            className="ml-auto pr-4"
                            onPress={() => setShowDeleteModal(true)}
                        >
                            <X size={24} color={Colors.light.primary} />
                        </Pressable>
                    )}
                    <UnassignTask
                        showDeleteModal={showDeleteModal}
                        setShowDeleteModal={setShowDeleteModal}
                        userEmail={name}
                        uid={uid}
                        taskId={taskId}
                        projectId={projectId}
                        setMembers={setMembers} />
                </HStack>
            </VStack>
        </Box >
    );
}
