import AssigneeCard from "@/components/card/AssigneeCard";
import DatePickerField from "@/components/datepicker/DatePickerField";
import DeleteTask from "@/components/popup/DeleteTask";
import EditTask from "@/components/popup/EditTask";
import StatusMenu from "@/components/popup/StatusMenu";
import TaskPriorityMenu from "@/components/popup/TaskPriorityMenu";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { AddIcon, ChevronsLeftIcon, EditIcon, TrashIcon } from "@/components/ui/icon";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { VStack } from "@/components/ui/vstack";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, Text, View } from "react-native";
import { DateType } from "react-native-ui-datepicker";
import { tasks } from "../task_data";

export default function TaskDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();

    const taskDetail = tasks.find((item) => item.id === id);
    const [title, setTitle] = useState(taskDetail?.title ?? "");
    const [description, setDescription] = useState(taskDetail?.description ?? "");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [status, setStatus] = useState(taskDetail?.status ?? "");
    const [priority, setPriority] = useState(taskDetail?.priority ?? "");
    const [dueDate, setDueDate] = useState<DateType>(taskDetail?.endDate);

    return (
        <View className="flex-1">
            <Box className='flex-row justify-start mx-6'>
                <Button className='bg-white p-0' onPress={() => router.back()}>
                    <ButtonIcon className='text-lightPrimary font-semibold text-xl' as={ChevronsLeftIcon} />
                    <ButtonText className='text-lightPrimary font-semibold text-xl'>Back</ButtonText>
                </Button>
            </Box>

            <Box className="flex-row justify-between items-center my-8  mx-6">
                <Box>
                    <Text className="text-darkTextPrimary font-semibold text-3xl">{taskDetail?.title}</Text>
                </Box>
                <Box className="flex-row justify-between gap-2">
                    <Button className="rounded-md aspect-square p-3.5" variant="outline" action="negative" size="xl" onPress={() => setShowDeleteModal(true)}>
                        <ButtonIcon className='text-red-500 font-bold text-xl' as={TrashIcon} />
                    </Button>
                    <DeleteTask showDeleteModal={showDeleteModal} setShowDeleteModal={setShowDeleteModal} title={taskDetail?.title}></DeleteTask>

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
                    <TextareaInput type="text" className="text-darkTextPrimary" value={taskDetail?.description} />
                </Textarea>
            </VStack>

            <Box className="flex-row justify-between gap-2 items-center my-4 mx-6">
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
                    <Button className="rounded-md aspect-square p-3.5" variant="outline" action="positive" size="xl" onPress={() => setShowEditModal(true)}>
                        <ButtonIcon className='text-lightPrimary font-bold text-xl' as={AddIcon} />
                    </Button>
                </Box>
                <FlatList
                    className="mt-2"
                    data={taskDetail?.assignee}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <AssigneeCard
                            name={item.name}
                        />
                    )}
                />

            </VStack>

        </View>
    );
}
