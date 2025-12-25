import TaskCard from "@/components/card/TaskCard";
import NewTaskModal from "@/components/project/NewTask";
import { Box } from "@/components/ui/box";
import { Colors } from "@/constants/theme";
import { useProjects } from "@/context/ProjectsContext";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronsLeft, Plus, SquarePen, UsersRound } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, TouchableOpacity } from "react-native";

export default function ProjectDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [showAddTaskModal, setShowAddTaskModal] = useState(false);
    const { project, projectTasks, loading, error, loadProjectById } = useProjects();

    useEffect(() => {
        loadProjectById(id);
    }, []);

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
                <ChevronsLeft size={18} color={Colors.light.primary} />
                <Text className="ml-1 text-lightPrimary font-medium">Back</Text>
            </Pressable>
            {loading ? (
                <Box className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" />
                </Box>
            ) : (
                <>
                    <Box className="flex-row items-center justify-between mb-4 px-6">
                        <Text className="text-3xl font-semibold">{project?.project.proj_name}</Text>

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
                                            `/(main)/dashboard/(work)/projects/${project?.project.proj_id}/edit`
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
                            {project?.project.description}
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
                        data={projectTasks}
                        keyExtractor={(item) => item.task_id}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <Pressable
                                onPress={() =>
                                    router.push(`/dashboard/tasks/${item.task_id}`)
                                }
                            >
                                <TaskCard
                                    id={item.task_id}
                                    title={item.task_name}
                                    description={item.content}
                                    priority={"medium"}
                                    status={item.status.toUpperCase()}
                                    endDate={new Date(item.endAt)}
                                    inProject={true}
                                />
                            </Pressable>)}
                    >
                    </FlatList>

                    <NewTaskModal
                        visible={showAddTaskModal}
                        onClose={() => setShowAddTaskModal(false)} 
                        projectId={id}/>
                        
                </>
            )}

        </Box>
    )
} 