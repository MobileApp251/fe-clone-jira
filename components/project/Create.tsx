import { HStack } from "@/components/ui/hstack";
import {
    Input,
    InputField
} from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Colors } from "@/constants/theme";
import { Plus, X } from "lucide-react-native";
import { useState } from "react";
import { Modal, Pressable } from "react-native";
import DatePickerField from "../datepicker/DatePickerField";
import StatusPickerField from "../statuspicker/StatusPickerField";

type CreateProjectProps = {
    visible: boolean;
    onClose: () => void;
};

export default function CreateProjectModal({ visible, onClose }: CreateProjectProps) {
    const [status, setStatus] = useState<string>();
    return (
        <Modal transparent animationType="fade" visible={visible}>
            <Pressable
                onPress={onClose}
                className="flex-1 bg-black/50 justify-center items-center px-4"
            >
                <Pressable className="w-full bg-white rounded-2xl p-5">
                    <Text className="text-xl font-semibold mb-4 text-darkTextPrimary">
                        Create new project
                    </Text>

                    <Text className="font-medium mb-1 text-darkTextPrimary">
                        Title <Text className="text-red-500">*</Text>
                    </Text>
                    <Input className="mb-3 rounded-lg border-inputBorder">
                        <InputField 
                            placeholder="Project title" 
                            className="text-darkTextPrimary focus:text-darkTextPrimary focus:border focus:border-inputBorder focus:rounded-lg"
                        />
                    </Input>

                    <Text className="font-medium mb-1 text-darkTextPrimary">Description</Text>
                    <Input className="mb-3 rounded-lg h-24 border-inputBorder">
                        <InputField
                            placeholder="Description"
                            multiline
                            className="text-darkTextPrimary focus:text-darkTextPrimary focus:border focus:border-inputBorder focus:rounded-lg"
                        />
                    </Input>

                    <Text className="font-medium mb-1 text-darkTextPrimary">Start date</Text>
                    <DatePickerField/>

                    <Text className="font-medium mb-1 text-darkTextPrimary">Due date</Text>
                    <DatePickerField/>

                    <Text className="font-medium mb-1 text-darkTextPrimary">Status</Text>
                    <StatusPickerField
                        value={status}
                        onChange={setStatus}
                    />

                    <HStack className="justify-between mt-6">
                        <Pressable
                        onPress={onClose}
                        className="border border-indanger rounded-xl px-4 py-2 flex-row items-center"
                        >
                        <X size={16} color={Colors.status.danger} />
                        <Text className="text-indanger ml-1 font-medium">
                            Cancel
                        </Text>
                        </Pressable>

                        <Pressable className="bg-lightPrimary rounded-xl px-4 py-2 flex-row items-center">
                        <Plus size={16} color="white" />
                        <Text className="text-white ml-1 font-medium">
                            Create
                        </Text>
                        </Pressable>
                    </HStack>
                </Pressable>
            </Pressable>
        </Modal>
    );
}
