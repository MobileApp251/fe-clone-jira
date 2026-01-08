import { getTaskById, updateTask } from "@/api/tasks";
import AssigneeCard from "@/components/card/AssigneeCard";
import DatePickerField from "@/components/datepicker/DatePickerField";
import DeleteTask from "@/components/popup/DeleteTask";
import EditAssignee from "@/components/popup/EditAssignee";
import EditTask from "@/components/popup/EditTask";
import StatusMenu from "@/components/popup/StatusMenu";
import TaskPriorityMenu from "@/components/popup/TaskPriorityMenu";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { ChevronsLeftIcon, EditIcon, TrashIcon } from "@/components/ui/icon";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { Toast, ToastDescription, ToastTitle, useToast } from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";
import { useProjects } from "@/context/ProjectsContext";
import { TaskPriority } from "@/utils/taskStatus";
import { ProjectMembers, TaskData } from "@/utils/workType";
import dayjs from "dayjs";
import { useLocalSearchParams, useRouter } from "expo-router";
import { UserPlus } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, Text, View } from "react-native";
import { DateType } from "react-native-ui-datepicker";

type ToastType = "error" | "warning" | "success" | "info" | "muted" | undefined;

export default function TaskDetail() {
    const router = useRouter();

    const { projectTasks, updateProjectTask, project } = useProjects();

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showEditAssigneeModal, setShowEditAssigneeModal] = useState(false);

    const [update, setUpdate] = useState(false);

    const [task, setTask] = useState<TaskData>();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("");
    const [priority, setPriority] = useState<TaskPriority>("");
    const [dueDate, setDueDate] = useState<DateType>();
    const [startAt, setStartAt] = useState<DateType>();
    const [members, setMembers] = useState<ProjectMembers[]>([]);

    const { id, projectId } = useLocalSearchParams<{
        id: string;
        projectId: string;
    }>();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    const fetchTask = useCallback(async (force = false) => {
        if (!force && task) return;

        try {
            setLoading(true);
            const data = await getTaskById(String(projectId), String(id));

            setTask(data.task)
            setTitle(data.task.task_name);
            setDescription(data.task.content);
            setStatus(data.task.status);
            setPriority(data.task.priority);
            setStartAt(new Date(data.task.startAt));
            setDueDate(new Date(data.task.endAt));
            setMembers(data.members);
            setError(null);
        } catch (err: any) {
            setError(err.message ?? "Failed to load task");
        } finally {
            setLoading(false);
        }
    }, [id, projectId, task]);

    useEffect(() => {
        fetchTask();
    }, [fetchTask]);

    useEffect(() => {
        if (update) {
            handleSaveEdit();
        }
    }, [update]);

    const handleSaveEdit = async () => {
        try {
            const payload = {
                task_name: title,
                content: description,
                priority: priority,
                status: status,
                startAt: startAt ? dayjs(startAt).toISOString() : "",
                endAt: dueDate ? dayjs(dueDate).toISOString() : ""
            };
            const res = await updateTask(projectId, id, payload);

            if (!res) {
                throw new Error("Update task failed");
            }

            fetchTask();
            updateProjectTask(id, res);
            setUpdate(false);
            handleToast("success", "Edit task!", `Task has been updated successfully.`)
        } catch (e) {
            console.log(e);
        } finally {
            setUpdate(false);
            console.log(projectTasks)
        }
    };

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

    return (
        <View className="flex-1">
            <Box className='flex-row justify-start mx-6'>
                <Button className='bg-white p-0' onPress={() => router.back()}>
                    <ButtonIcon className='text-lightPrimary font-medium' as={ChevronsLeftIcon} />
                    <ButtonText className='text-lightPrimary font-medium'>Back</ButtonText>
                </Button>
            </Box>
            {loading ?
                <Box className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" testID="loading-indicator" />
                </Box> :
                <>
                    <Box className="flex-row justify-between items-center mx-6 mb-4">
                        <Box>
                            <Text className="text-darkTextPrimary font-semibold text-3xl">{title}</Text>
                        </Box>
                        <Box className="flex-row justify-between gap-2">
                            <Button className="rounded-md aspect-square p-3.5" variant="outline" action="negative" size="xl" onPress={() => setShowDeleteModal(true)}>
                                <ButtonIcon className='text-red-500 font-bold text-xl' as={TrashIcon} />
                            </Button>
                            <DeleteTask
                                showDeleteModal={showDeleteModal}
                                setShowDeleteModal={setShowDeleteModal}
                                title={title}
                                projectId={projectId}
                                taskId={id}
                                onDeleted={fetchTask}
                                onTaskDetail={true}
                            ></DeleteTask>

                            <Button className="rounded-md aspect-square p-3.5" variant="outline" action="positive" size="xl" onPress={() => setShowEditModal(true)}>
                                <ButtonIcon className='text-lightPrimary font-bold text-xl' as={EditIcon} />
                            </Button>
                            <EditTask
                                showEditModal={showEditModal}
                                setShowEditModal={setShowEditModal}
                                title={title} setTitle={setTitle}
                                description={description}
                                setDescription={setDescription}
                                projectId={projectId}
                                taskId={id}
                                task={task!}
                                fetchTask={fetchTask}></EditTask>
                        </Box>
                    </Box>

                    <VStack space="xs" className=" mx-6">
                        <Text className="text-darkTextPrimary font-semibold text-lg">Description</Text>
                        <Textarea
                            size="md"
                            isReadOnly={true}
                            isInvalid={false}
                            isDisabled={false}
                        >
                            <TextareaInput type="text" className="text-darkTextPrimary" value={description} />
                        </Textarea>
                    </VStack>

                    <Box className="flex-row justify-between gap-1 items-center my-4 mx-6">
                        <Box className="flex-1">
                            <StatusMenu status={status} setStatus={setStatus} setOnUpdate={setUpdate} />
                        </Box>

                        <Box className="flex-1">
                            <TaskPriorityMenu priority={priority} setPriority={setPriority} setOnUpdate={setUpdate} />
                        </Box>

                        <Box className="flex-1">
                            <DatePickerField date={dueDate} setDate={setDueDate} label="Due Date" setUpdateDate={setUpdate} />
                        </Box>
                    </Box>


                    <VStack space="xs">
                        <Box className="flex-row justify-between items-center mx-6">
                            <Text className="text-darkTextPrimary font-semibold text-lg">Assignee</Text>
                            <Button className="rounded-md aspect-square p-3.5" variant="outline" action="positive" size="xl" onPress={() => setShowEditAssigneeModal(true)}>
                                <ButtonIcon className='text-lightPrimary font-bold text-xl' as={UserPlus} />
                            </Button>
                        </Box>
                        <EditAssignee
                            showEditAssigneeModal={showEditAssigneeModal}
                            setShowEditAssigneeModal={setShowEditAssigneeModal}
                            assigneeList={project.members.filter(projectMember => !members.map(taskMember => taskMember.uid).includes(projectMember.uid))}
                            taskId={task ? task.task_id : ""}
                            reloadTask={fetchTask}
                            projectId={projectId} />
                        <FlatList
                            className="mt-2"
                            data={members}
                            keyExtractor={(item) => item.uid}
                            showsVerticalScrollIndicator={false}
                            refreshControl={
                                <RefreshControl refreshing={loading} onRefresh={fetchTask} />
                            }
                            renderItem={({ item }) => (
                                <AssigneeCard
                                    name={item.email}
                                    uid={item.uid}
                                    taskId={task ? task.task_id : ""}
                                    projectId={projectId}
                                    setMembers={setMembers}
                                />
                            )}
                        />

                    </VStack>
                </>}
        </View>
    );
}
