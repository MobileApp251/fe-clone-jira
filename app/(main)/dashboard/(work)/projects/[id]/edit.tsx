import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Colors } from "@/constants/theme";
import { useProjects } from "@/context/ProjectsContext";
import { router, useLocalSearchParams } from "expo-router";
import { Check, ChevronsLeft, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Pressable, TextInput } from "react-native";

export default function EditProjectScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { project, projectTasks, loading, error, loadProjectById } = useProjects();

    const [name, setName] = useState(project?.proj_name ?? "");
    const [description, setDescription] = useState(project?.description ?? "");

    useEffect(() => {
        loadProjectById(id);
    }, []);

    if (!project) {
        return (
            <Box className="flex-1 items-center justify-center">
                <Text>Project not found</Text>
            </Box>
        );
    }

    return (
        <Box className="flex-1 px-6">
            <Pressable
                className="flex-row items-center mb-4"
                onPress={() => router.back()}
            >
                <ChevronsLeft size={18} color={Colors.light.primary} />
                <Text className="ml-1 text-lightPrimary font-medium">Back</Text>
            </Pressable>

            <Text className="text-3xl font-semibold text-darkTextPrimary">{project?.proj_name}</Text>

            <Text className="font-medium my-1 text-darkTextPrimary">Name</Text>
            <Box className="mb-4">
                <TextInput
                    value={name}
                    onChangeText={setName}
                    className="border border-inputBorder rounded-l-lg rounded-tr-lg p-3"
                />

                <Box className="flex-row justify-end">
                    <Pressable className="p-2 border-x border-b rounded-bl-lg border-inputBorder">
                        <Check size={18} color="green" />
                    </Pressable>

                    <Pressable className="p-2 border-x border-b rounded-br-lg border-inputBorder">
                        <X size={18} color={Colors.status.danger} />
                    </Pressable>
                </Box>
            </Box>


            <Text className="font-medium my-1 text-darkTextPrimary">Description</Text>
            <Box className="mb-4">
                <TextInput
                    multiline
                    value={description}
                    onChangeText={setDescription}
                    className="border border-inputBorder rounded-l-lg rounded-tr-lg p-3"
                />

                <Box className="flex-row justify-end">
                    <Pressable className="p-2 border-x border-b rounded-bl-lg border-inputBorder">
                        <Check size={18} color="green" />
                    </Pressable>

                    <Pressable className="p-2 border-x border-b rounded-br-lg border-inputBorder">
                        <X size={18} color={Colors.status.danger} />
                    </Pressable>
                </Box>
            </Box>

        </Box>
    );
}
