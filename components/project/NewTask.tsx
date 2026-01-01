import { HStack } from "@/components/ui/hstack";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Colors } from "@/constants/theme";
import { useProjects } from "@/context/ProjectsContext";
import { TaskPriority, TaskStatus } from "@/utils/taskStatus";
import dayjs from "dayjs";
import { ChevronLeft, Plus, X } from "lucide-react-native";
import { useState } from "react";
import { Pressable } from "react-native";
import { DateType } from "react-native-ui-datepicker";
import DatePickerField from "../datepicker/DatePickerField";
import PriorityPicker from "../prioritypicker/PriorityPicker";
import StatusPickerField from "../statuspicker/StatusPickerField";
import { ButtonSpinner } from "../ui/button";
import { Modal, ModalBackdrop, ModalContent } from "../ui/modal";

type AddNewTaskProps = {
    visible: boolean;
    onClose: () => void;
    projectId: string;
};

export default function NewTaskModal({ visible, onClose, projectId }: AddNewTaskProps) {
    const [step, setStep] = useState<1 | 2>(1);
    const { createNewTask } = useProjects();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [taskName, setTaskName] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState<TaskStatus>("open");
    const [priority, setPriority] = useState<TaskPriority>("medium");
    const [startDate, setStartDate] = useState<DateType>();
    const [endDate, setEndDate] = useState<DateType>();

    const handleClose = () => {
        setStep(1);
        onClose();
        setTaskName("");
        setDescription("");
        setStatus("open");
        setPriority("medium");
        setStartDate(null);
        setEndDate(null);
    };

    const handleCreate = async () => {
        try {
            setLoading(true);
            setError(null);
            await createNewTask(projectId, {
                task_name: taskName,
                content: description,
                priority: priority,
                status: status,
                startAt: startDate ? dayjs(startDate).toISOString() : "",
                endAt: endDate ? dayjs(endDate).toISOString() : "",
            })

            handleClose();
        } catch (e: any) {
            setError(e?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Modal isOpen={visible} onClose={handleClose} size="md">
            <ModalBackdrop />
            <ModalContent className="w-full -mt-40 rounded-2xl p-5 bg-white">
                <Text className="text-xl font-semibold mb-1 text-darkTextPrimary">
                    Add new task
                </Text>

                <Text className="text-sm text-gray-400 mb-4">
                    Step {step} of 2
                </Text>

                {/* ================= STEP 1 ================= */}
                {step === 1 && (
                    <>
                        <Text className="font-medium mb-1 text-darkTextPrimary">
                            Task name <Text className="text-red-500">*</Text>
                        </Text>

                        <Input className="mb-3 rounded-lg border-inputBorder">
                            <InputField
                                value={taskName}
                                onChangeText={setTaskName}
                                placeholder="Task name"
                                className="text-darkTextPrimary"
                            />
                        </Input>

                        <Text className="font-medium mb-1 text-darkTextPrimary">
                            Description
                        </Text>

                        <Input className="mb-3 rounded-lg h-24 border-inputBorder">
                            <InputField
                                value={description}
                                onChangeText={setDescription}
                                multiline
                                placeholder="Description"
                                className="text-darkTextPrimary"
                            />
                        </Input>

                        <Text className="font-medium mb-1 text-darkTextPrimary">
                            Start date
                        </Text>
                        <DatePickerField
                            date={startDate}
                            setDate={setStartDate}
                            maxDate={endDate}
                        />

                        <Text className="font-medium mb-1 text-darkTextPrimary">
                            Due date
                        </Text>
                        <DatePickerField
                            date={endDate}
                            setDate={setEndDate}
                            minDate={startDate}
                        />
                    </>
                )}

                {/* ================= STEP 2 ================= */}
                {step === 2 && (
                    <>
                        <Text className="font-medium mb-1 text-darkTextPrimary">
                            Priority
                        </Text>

                        <PriorityPicker
                            value={priority}
                            onChange={setPriority}
                        />

                        <Text className="font-medium mb-1 mt-2 text-darkTextPrimary">
                            Assignee
                        </Text>

                        <StatusPickerField
                            value={status}
                            onChange={setStatus}
                        />

                        <Text className="font-medium mb-1 mt-2 text-darkTextPrimary">
                            Notify before deadline
                        </Text>

                        <HStack className="items-center gap-2">
                            {["hh", "mm", "ss"].map((_, i) => (
                                <Input
                                    key={i}
                                    className="w-14 h-12 rounded-lg border-inputBorder"
                                >
                                    <InputField
                                        keyboardType="number-pad"
                                        placeholder="00"
                                        maxLength={2}
                                        textAlign="center"
                                        className="text-darkTextPrimary"
                                    />
                                </Input>
                            ))}
                        </HStack>
                    </>
                )}

                {/* ================= FOOTER ================= */}
                <HStack className="justify-between mt-6">
                    {step === 1 ? (
                        <>
                            <Pressable
                                onPress={handleClose}
                                className="border border-indanger rounded-xl px-4 py-2 flex-row items-center"
                            >
                                <X size={16} color={Colors.status.danger} />
                                <Text className="text-indanger ml-1 font-medium">
                                    Cancel
                                </Text>
                            </Pressable>

                            <Pressable
                                onPress={() => setStep(2)}
                                disabled={!taskName}
                                className={`rounded-xl px-6 py-2 ${taskName ? "bg-lightPrimary" : "bg-gray-300"
                                    }`}
                            >
                                <Text className="text-white font-medium">Next</Text>
                            </Pressable>
                        </>
                    ) : (
                        <>
                            <Pressable
                                onPress={() => setStep(1)}
                                className="flex-row items-center gap-1 border border-inputBorder rounded-xl px-4 py-2"
                            >
                                <ChevronLeft size={16} color={Colors.light.primary} />
                                <Text className="font-medium text-lightPrimary">
                                    Back
                                </Text>
                            </Pressable>

                            <Pressable
                                onPress={handleCreate}
                                className="bg-lightPrimary rounded-xl px-4 py-2 flex-row items-center"
                            >
                                {loading ? (<ButtonSpinner color="gray" />) : (<Plus size={16} color="white" />)}
                                <Text className="text-white ml-1 font-medium">
                                    Create
                                </Text>
                            </Pressable>
                        </>
                    )}
                </HStack>
            </ModalContent>
        </Modal>
    );
}
