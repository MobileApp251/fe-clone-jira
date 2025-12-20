import TaskCard from "@/components/card/TaskCard";
import NewTaskModal from "@/components/project/NewTask";
import { Box } from "@/components/ui/box";
import { Colors } from "@/constants/theme";
import { Task } from "@/utils/workType";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronsLeft, Plus, SquarePen, UsersRound } from "lucide-react-native";
import { useState } from "react";
import { FlatList, Pressable, Text, TouchableOpacity } from "react-native";
import { projects } from "../project_data";

export default function ProjectDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const project = projects.find((p) => p.id === id);
    const tasks: Task[] = project?.tasks ?? [];
    const [showAddTaskModal, setShowAddTaskModal] = useState(false);
    
    if (!project) {
        return (
            <Box className="flex-1 justify-center items-center">
                <Text>Project not found</Text>
            </Box>
        );
    }

    return (
        <Box className="flex-1">
            <Pressable className="flex-row items-center px-6" onPress={() => router.back()}>
                <ChevronsLeft size={18} color={Colors.light.primary}/>
                <Text className="ml-1 text-lightPrimary font-medium">Back</Text>
            </Pressable>
            <Box className="flex-row items-center justify-between mb-4 px-6">
                <Text className="text-3xl font-semibold">{project.title}</Text>

                <Box className="flex-row gap-3">
                    <Box className="w-12 h-12">
                        <TouchableOpacity
                            className="h-full w-full rounded-lg items-center justify-center border border-lightPrimary"
                            onPress={() =>
                                router.push(`/(main)/dashboard/(work)/projects/${id}/members`)
                            }>
                            <UsersRound size={22} color={Colors.light.primary} />
                        </TouchableOpacity>
                    </Box>
                    <Box className="w-12 h-12">
                        <TouchableOpacity
                            onPress={() =>
                                router.push(
                                `/(main)/dashboard/(work)/projects/${project.id}/edit`
                                )
                            }
                            className="h-full w-full rounded-lg items-center justify-center border border-lightPrimary">
                            <SquarePen size={22} color={Colors.light.primary} />
                        </TouchableOpacity>
                    </Box>
                </Box>
            </Box>
            <Box className="mb-4 px-6">
                <Text className="font-semibold mb-1 text-lg text-darkTextPrimary">Description</Text>
                <Text className="text-darkTextPrimary">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt. Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis, eaque vero ex magnam labore iure quibusdam molestias culpa consequatur quod, porro quo, totam id explicabo. Impedit quis sapiente molestiae vitae!
                </Text>
            </Box>
            <Box className="flex-row justify-between items-center mb-3 px-6">
                <Text className="font-semibold mb-1 text-lg text-darkTextPrimary">Tasks</Text>
                <Box className="w-12 h-12">
                    <TouchableOpacity
                        onPress={() => setShowAddTaskModal(true)}
                        className="h-full w-full rounded-lg items-center justify-center border border-lightPrimary">
                        <Plus size={22} color={Colors.light.primary} />
                    </TouchableOpacity>
                </Box>
            </Box>
            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                <Pressable
                    onPress={() =>
                        router.push(`/(main)/dashboard/(work)/tasks/${item.id}`)
                    }
                >
                    <TaskCard
                        title={item.title}
                        description={item.description}
                        priority={item.priority}
                        status={item.status}
                        endDate={item.endDate}
                        inProject={true}
                    />
                </Pressable>)}
            >
            </FlatList>

            <NewTaskModal 
                visible={showAddTaskModal}
                onClose={() => setShowAddTaskModal(false)}/>
        </Box>
    )
} 