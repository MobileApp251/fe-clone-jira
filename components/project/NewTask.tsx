import { HStack } from "@/components/ui/hstack";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Colors } from "@/constants/theme";
import { ChevronLeft, Plus, X } from "lucide-react-native";
import { useState } from "react";
import { Modal, Pressable } from "react-native";
import { DateType } from "react-native-ui-datepicker";
import DatePickerField from "../datepicker/DatePickerField";
import StatusPickerField from "../statuspicker/StatusPickerField";

type AddNewTaskProps = {
    visible: boolean;
    onClose: () => void;
};

export default function NewTaskModal({ visible, onClose }: AddNewTaskProps) {
    const [step, setStep] = useState<1 | 2>(1);

    const [taskName, setTaskName] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState<string>();
    const [startDate, setStartDate] = useState<DateType>();
    const [endDate, setEndDate] = useState<DateType>();

    const handleClose = () => {
        setStep(1);
        onClose();
    };

    return (
        <Modal transparent animationType="fade" visible={visible}>
            <Pressable
                onPress={handleClose}
                className="flex-1 bg-black/50 justify-center items-center px-4"
            >
                <Pressable className="w-full bg-white rounded-2xl p-5">
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
                                    placeholder="Project title"
                                    className="text-darkTextPrimary focus:text-darkTextPrimary focus:border focus:border-inputBorder focus:rounded-lg"
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
                                    className="text-darkTextPrimary focus:text-darkTextPrimary focus:border focus:border-inputBorder focus:rounded-lg"
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
                            <StatusPickerField
                                value={status}
                                onChange={setStatus}
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
                                <Input className="w-14 h-12 rounded-lg border-inputBorder">
                                    <InputField
                                        keyboardType="number-pad"
                                        placeholder="00"
                                        maxLength={2}
                                        textAlign="center"
                                        className="text-darkTextPrimary focus:text-darkTextPrimary focus:border focus:border-inputBorder focus:rounded-lg"
                                    />
                                </Input>

                                <Text className="text-lg font-semibold">:</Text>

                                <Input className="w-14 h-12 rounded-lg border-inputBorder">
                                    <InputField
                                        keyboardType="number-pad"
                                        placeholder="00"
                                        maxLength={2}
                                        textAlign="center"
                                        className="text-darkTextPrimary focus:text-darkTextPrimary focus:border focus:border-inputBorder focus:rounded-lg"
                                    />
                                </Input>

                                <Text className="text-lg font-semibold">:</Text>

                                <Input className="w-14 h-12 rounded-lg border-inputBorder">
                                    <InputField
                                        keyboardType="number-pad"
                                        placeholder="00"
                                        maxLength={2}
                                        textAlign="center"
                                        className="text-darkTextPrimary focus:text-darkTextPrimary focus:border focus:border-inputBorder focus:rounded-lg"
                                    />
                                </Input>
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
                                    <X
                                        size={16}
                                        color={Colors.status.danger}
                                    />
                                    <Text className="text-indanger ml-1 font-medium">
                                        Cancel
                                    </Text>
                                </Pressable>

                                <Pressable
                                    onPress={() => setStep(2)}
                                    disabled={!taskName}
                                    className={`rounded-xl px-6 py-2 ${
                                        taskName
                                            ? "bg-lightPrimary"
                                            : "bg-gray-300"
                                    }`}
                                >
                                    <Text className="text-white font-medium">
                                        Next
                                    </Text>
                                </Pressable>
                            </>
                        ) : (
                            <>
                                <Pressable
                                    onPress={() => setStep(1)}
                                    className="flex-row items-center gap-1 border border-inputBorder rounded-xl px-4 py-2"
                                >
                                    <ChevronLeft size={16} color={Colors.light.primary}/> 
                                    <Text className="font-medium text-lightPrimary">Back</Text>
                                </Pressable>

                                <Pressable
                                    className="bg-lightPrimary rounded-xl px-4 py-2 flex-row items-center"
                                >
                                    <Plus size={16} color="white" />
                                    <Text className="text-white ml-1 font-medium">
                                        Create
                                    </Text>
                                </Pressable>
                            </>
                        )}
                    </HStack>
                </Pressable>
            </Pressable>
        </Modal>
    );
}
