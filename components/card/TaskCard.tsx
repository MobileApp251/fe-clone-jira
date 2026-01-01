import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Colors } from "@/constants/theme";

import { priorityStyles, TASK_STATUS_STYLE, TaskPriority } from "@/utils/taskStatus";
import { ProjectMembers } from "@/utils/workType";
import { useRouter } from "expo-router";
import { Trash2, User } from "lucide-react-native";
import { useState } from "react";
import { Pressable } from "react-native";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import DeleteTask from "../popup/DeleteTask";

type Props = {
    id: string;
    title: string;
    description: string;
    priority?: TaskPriority;
    status: string;
    endDate: Date;
    inProject?: boolean;
    members: ProjectMembers[];
    projectId: string;
    onMyTask?: boolean;
};

export default function TaskCard({
    id,
    title,
    description,
    priority,
    status,
    endDate,
    inProject,
    members,
    projectId,
    onMyTask = false
}: Props) {
    const style =
        TASK_STATUS_STYLE[status] ??
        TASK_STATUS_STYLE["Pending"];

    const router = useRouter();

    const viewDetailTask = (taskId: string) => {
        router.push({
            pathname: "/dashboard/tasks/[id]",
            params: {
                id: taskId,
                projectId,
            },
        });
    };

    const StatusIcon = style.icon;

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const renderRightActions = () => {
        return (
            <>
                <Pressable
                    onPress={() => setShowDeleteModal(true)}
                    className="bg-red-500 justify-center items-center w-20 mb-4 -ml-8 mr-6 rounded-r-2xl"
                >
                    <Trash2 size={20} color="white" />
                    <Text className="text-white text-xs mt-1">Delete</Text>
                </Pressable>
                <DeleteTask showDeleteModal={showDeleteModal} setShowDeleteModal={setShowDeleteModal} onTaskDetail={false} title={title} projectId={projectId} taskId={id}></DeleteTask>
            </>
        );
    };

    return (
        <Swipeable
            renderRightActions={renderRightActions}
            overshootRight={false}
            enabled={!onMyTask}
        >
            <Pressable onPress={() => viewDetailTask(id)}>
                <Box
                    className="rounded-2xl p-4 mb-4 mx-6 shadow-sm"
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
                    <HStack className="justify-between items-center">
                        <Text className="text-lg font-semibold" style={{ color: style.text }}>
                            {title}
                        </Text>

                        {priority && (
                            <HStack
                                className={`items-center px-2.5 py-1 rounded-full ${priorityStyles[priority].bg
                                    }`}
                            >
                                <Text
                                    className={`text-md font-semibold ${priorityStyles[priority].text
                                        }`}
                                >
                                    {priority}
                                </Text>
                            </HStack>
                        )}
                    </HStack>

                    <HStack className="mt-3 items-start">
                        <Box className={inProject ? "flex-1 pr-3" : "w-full"}>
                            <Text
                                className="text-sm leading-5"
                                style={{ color: style.text }}
                                numberOfLines={inProject ? 2 : undefined}
                            >
                                {description}
                            </Text>
                        </Box>

                        {inProject && (
                            <HStack space="xs" className="items-center">
                                {members.map((_, index) => (
                                    <Box
                                        key={index}
                                        className="w-8 h-8 rounded-full bg-inputBorder items-center justify-center"
                                    >
                                        <User size={16} color={Colors.light.primary} />
                                    </Box>
                                ))}
                            </HStack>
                        )}
                    </HStack>


                    <Box className="h-[1px] bg-gray-300 my-3" />

                    <HStack className="justify-between items-center">
                        <HStack space="sm" className="items-center">
                            <StatusIcon size={16} color={style.iconColor} />
                            <Text className="text-sm font-medium" style={{ color: style.text }}>
                                {status}
                            </Text>
                        </HStack>

                        <Text className="text-sm text-darkTextPrimary">
                            Due date: {endDate.toDateString()}
                        </Text>
                    </HStack>
                </Box>
            </Pressable>
        </Swipeable>
    );
}
