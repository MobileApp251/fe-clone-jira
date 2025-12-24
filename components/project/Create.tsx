import { HStack } from "@/components/ui/hstack";
import {
    Input,
    InputField
} from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Colors } from "@/constants/theme";
import { useProjects } from "@/context/ProjectsContext";
import { Plus, X } from "lucide-react-native";
import { useState } from "react";
import { Pressable } from "react-native";
import { DateType } from "react-native-ui-datepicker";
import DatePickerField from "../datepicker/DatePickerField";
import StatusPickerField from "../statuspicker/StatusPickerField";
import { Modal, ModalBackdrop, ModalBody, ModalContent, ModalFooter, ModalHeader } from "../ui/modal";

type CreateProjectProps = {
    visible: boolean;
    onClose: () => void;
};

export default function CreateProjectModal({ visible, onClose }: CreateProjectProps) {
    const [status, setStatus] = useState<string>();
    const [startDate, setStartDate] = useState<DateType>();
    const [endDate, setEndDate] = useState<DateType>();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const { projects, project, createNewProject, loading, error } = useProjects();

    const handleCreateProject = async () => {
        try {
            await createNewProject({
                createAt: (new Date()).toString(),
                description: description,
                endAt: endDate?.toLocaleString() ?? "",
                proj_name: title,
                startAt: startDate?.toLocaleString() ?? "",
                updateAt: startDate?.toLocaleString() ?? ""
            });
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <Modal
            isOpen={visible}
            onClose={onClose}
            size="md"
        >
            <ModalBackdrop />

            <ModalContent className="w-full -mt-40 bg-white mx-4 rounded-2xl p-5">
                <ModalHeader>
                    <Text className="text-xl font-semibold text-darkTextPrimary">
                        Create new project
                    </Text>
                </ModalHeader>

                <ModalBody>
                    <Text className="font-medium mb-1 text-darkTextPrimary">
                        Title <Text className="text-red-500">*</Text>
                    </Text>
                    <Input className="mb-3 rounded-lg border-inputBorder">
                        <InputField
                            value={title}
                            onChangeText={setTitle}
                            placeholder="Project title"
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
                            placeholder="Description"
                            multiline
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

                    <Text className="font-medium mb-1 text-darkTextPrimary mt-3">
                        Due date
                    </Text>
                    <DatePickerField
                        date={endDate}
                        setDate={setEndDate}
                        minDate={startDate}
                    />

                    <Text className="font-medium mb-1 text-darkTextPrimary mt-3">
                        Status
                    </Text>
                    <StatusPickerField
                        value={status}
                        onChange={setStatus}
                    />
                </ModalBody>

                <ModalFooter>
                    <HStack className="justify-between w-full">
                        <Pressable
                            onPress={onClose}
                            className="border border-indanger rounded-xl px-4 py-2 flex-row items-center"
                        >
                            <X size={16} color={Colors.status.danger} />
                            <Text className="text-indanger ml-1 font-medium">
                                Cancel
                            </Text>
                        </Pressable>

                        <Pressable
                            onPress={handleCreateProject}
                            className="bg-lightPrimary rounded-xl px-4 py-2 flex-row items-center"
                        >
                            <Plus size={16} color="white" />
                            <Text className="text-white ml-1 font-medium">
                                Create
                            </Text>
                        </Pressable>
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );

}
