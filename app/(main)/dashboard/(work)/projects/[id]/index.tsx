import { updateProject } from "@/api/projects";
import TaskCard from "@/components/card/TaskCard";
import DatePickerField from "@/components/datepicker/DatePickerField";
import MarkAsDone from "@/components/markasdone/MarkAsDone";
import NewTaskModal from "@/components/project/NewTask";
import { Box } from "@/components/ui/box";
import { Toast, ToastDescription, ToastTitle, useToast } from "@/components/ui/toast";
import { Colors } from "@/constants/theme";
import { useProjects } from "@/context/ProjectsContext";
import { UpdateProjectDTO } from "@/utils/workType";
import dayjs from "dayjs";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronsLeft, Plus, SquarePen, UsersRound } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, TouchableOpacity } from "react-native";
import { DateType } from "react-native-ui-datepicker";

type ToastType = "error" | "warning" | "success" | "info" | "muted" | undefined;

export default function ProjectDetail() {
    const { id, actionTaskId } = useLocalSearchParams<{ id: string, actionTaskId: string }>();
    const [showAddTaskModal, setShowAddTaskModal] = useState(false);
    const { project, projectTasks, loading, updateProjectById, removeTask, loadProjectById } = useProjects();

    const [dueDate, setDueDate] = useState<DateType>();
    const [done, setDone] = useState(false);
    const [updateDate, setUpdateDate] = useState(false);

    useEffect(() => {
        loadProjectById(id);
        if (actionTaskId) {
            removeTask(actionTaskId);
        }
    }, [id, actionTaskId, loadProjectById]);

    useEffect(() => {
        if (!project) return;

        setDueDate(new Date(project.project.endAt));
        setDone(project.project.done);
    }, [project]);

    useEffect(() => {
        if (updateDate) {
            handleUpdateDueDate();
        }
    }, [updateDate]);

    const handleUpdateDueDate = async () => {
        try {
            const payload: UpdateProjectDTO = {
                done: project.project.done,
                endAt: dueDate ? dayjs(dueDate).toISOString() : "",
            }
            const res = await updateProject(project.project.proj_id, payload);
            updateProjectById(project.project.proj_id, res);
            setUpdateDate(false);
            handleToast("success", "Edit project!", `Project has been updated due date.`)
        } catch (error) {
            console.error(error);
        } finally {
            setUpdateDate(false);
        }
    }

    const toast = useToast();
    const [toastId, setToastId] = useState("0");
    const handleToast = (type: ToastType, title: string, text: string) => {
        if (!toast.isActive(toastId)) {
            showToast(type, title, text);
        }
    };
    const showToast = (type: ToastType, title: string, text: string) => {
        const newId = Math.random().toString();
        setToastId(newId);
        toast.show({
            id: newId,
            placement: 'bottom',
            duration: 3000,
            render: ({ id }) => {
                const uniqueToastId = 'toast-' + id;
                return (
                    <Toast nativeID={uniqueToastId} action={type} variant="outline" className="bg-white">
                        <ToastTitle>{title}</ToastTitle>
                        <ToastDescription className="text-darkTextPrimary">
                            {text}
                        </ToastDescription>
                    </Toast>
                );
            },
        });
    };

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
                        <Text className="text-3xl w-3/4 font-semibold">{project?.project.proj_name}</Text>

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

                    <Box className="flex-row justify-between gap-1 items-center my-4 mx-6">
                        <Box className="flex-1">
                            <MarkAsDone projectId={project.project.proj_id} value={done} onChange={setDone} />
                        </Box>
                        <Box className="flex-1">
                            <DatePickerField date={dueDate} setDate={setDueDate} label="Due Date" setUpdateDate={setUpdateDate} />
                        </Box>
                    </Box>

                    <FlatList
                        data={projectTasks}
                        keyExtractor={(item) => item.task.task_id}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <Pressable
                                onPress={() =>
                                    router.push(`/dashboard/tasks/${item.task.task_id}`)
                                }
                            >
                                <TaskCard
                                    id={item.task.task_id}
                                    title={item.task.task_name}
                                    description={item.task.content}
                                    priority={item.task.priority}
                                    status={item.task.status?.toUpperCase()}
                                    endDate={new Date(item.task.endAt)}
                                    inProject={true}
                                    members={item.members}
                                    projectId={item.task.proj_id}
                                />
                            </Pressable>)}
                    >
                    </FlatList>

                    <NewTaskModal
                        visible={showAddTaskModal}
                        onClose={() => setShowAddTaskModal(false)}
                        projectId={id} />

                </>
            )}

        </Box>
    )
} 