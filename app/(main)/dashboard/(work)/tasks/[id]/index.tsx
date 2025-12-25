import { getTaskById } from "@/api/tasks";
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
import { VStack } from "@/components/ui/vstack";
import { TaskAPIResponse } from "@/utils/workType";
import { useLocalSearchParams, useRouter } from "expo-router";
import { UserPlus } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { DateType } from "react-native-ui-datepicker";

export default function TaskDetail() {
    const router = useRouter();

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showEditAssigneeModal, setShowEditAssigneeModal] = useState(false);

    const [task, setTask] = useState<TaskAPIResponse>();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("");
    const [priority, setPriority] = useState("");
    const [dueDate, setDueDate] = useState<DateType>();

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

            setTask(data)
            setTitle(data.task_name);
            setDescription(data.content);
            setStatus(data.status);
            setPriority(data.priority);
            setDueDate(new Date(data.endAt));
            setError(null);
        } catch (err: any) {
            setError(err.message ?? "Failed to load task");
        } finally {
            setLoading(false);
        }
        }, [id, projectId]);

    useEffect(() => {
        fetchTask();
    }, [fetchTask]);
        
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
                    <ActivityIndicator size="large" />
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
                        <DeleteTask showDeleteModal={showDeleteModal} setShowDeleteModal={setShowDeleteModal} title={title}></DeleteTask>

                        <Button className="rounded-md aspect-square p-3.5" variant="outline" action="positive" size="xl" onPress={() => setShowEditModal(true)}>
                            <ButtonIcon className='text-lightPrimary font-bold text-xl' as={EditIcon} />
                        </Button>
                        <EditTask
                            showEditModal={showEditModal}
                            setShowEditModal={setShowEditModal}
                            title={title} setTitle={setTitle}
                            description={description}
                            setDescription={setDescription}></EditTask>
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
                        <StatusMenu status={status} setStatus={setStatus} />
                    </Box>

                    <Box className="flex-1">
                        <TaskPriorityMenu priority={priority} setPriority={setPriority} />
                    </Box>

                    <Box className="flex-1">
                        <DatePickerField date={dueDate} setDate={setDueDate} label="Due Date" />
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
                        assigneeList={[]} />
                    {/* <FlatList
                        className="mt-2"
                        data={taskDetail?.assignee}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <AssigneeCard
                                name={item.name}
                            />
                        )}
                    /> */}

                </VStack>
            </>}
        </View>
    );
}
