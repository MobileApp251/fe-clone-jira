import { updateProject } from "@/api/projects";
import { Box } from "@/components/ui/box";
import { ButtonSpinner } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Toast, ToastDescription, ToastTitle, useToast } from "@/components/ui/toast";
import { Colors } from "@/constants/theme";
import { useProjects } from "@/context/ProjectsContext";
import { UpdateProjectDTO } from "@/utils/workType";
import { router, useLocalSearchParams } from "expo-router";
import { Check, ChevronsLeft, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Pressable, TextInput } from "react-native";

type ToastType = "error" | "warning" | "success" | "info" | "muted" | undefined;


export default function EditProjectScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { project, loading, updateProjectById, loadProjectById } = useProjects();

    const [name, setName] = useState(project?.project.proj_name ?? "");
    const [description, setDescription] = useState(project?.project.description ?? "");
    const [originalName, setOriginalName] = useState(project.project.proj_name);
    const [originalDescription, setOriginalDescription] = useState(project.project.description);
    const [updateNameLoading, setUpdateNameLoading] = useState(false);
    const [updateDescriptionLoading, setUpdateDescriptionLoading] = useState(false);

    useEffect(() => {
        loadProjectById(id);
    }, [id, loadProjectById]);

    useEffect(() => {
        if (project) {
            setName(project.project.proj_name);
            setDescription(project.project.description ?? "");
        }
    }, [project]);

    const handleUpdateProject = async (field: string) => {
        try {
            let payload: UpdateProjectDTO;
            if (field === 'name') {
                setUpdateNameLoading(true);
                payload = {
                    proj_name: name,
                }
            } else {
                setUpdateDescriptionLoading(true);
                payload = {
                    description: description,
                }
            }
            const res = await updateProject(project.project.proj_id, payload);
            setOriginalName(res.proj_name);
            setName(res.proj_name);
            setOriginalDescription(res.description);
            setDescription(res.description);
            updateProjectById(project.project.proj_id, res)
            handleToast("success", "Edit project!", "Project has been edited successfully.")
        } catch (error) {
            console.error(error);
        } finally {
            setUpdateNameLoading(false);
            setUpdateDescriptionLoading(false);
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

            {!loading && <>
                <Text className="text-3xl font-semibold text-darkTextPrimary">{originalName}</Text>

                <Text className="font-medium my-1 text-darkTextPrimary">Name</Text>
                <Box className="mb-4">
                    <TextInput
                        value={name}
                        onChangeText={setName}
                        className="border border-inputBorder rounded-l-lg rounded-tr-lg p-3"
                    />

                    <Box className="flex-row justify-end">
                        <Pressable
                            disabled={name === originalName}
                            className={`p-2 border-x border-b rounded-bl-lg border-inputBorder 
                                        ${name === originalName ? 'opacity-40' : ''}`}
                            onPress={() => handleUpdateProject('name')}
                        >
                            {updateNameLoading ? (
                                <ButtonSpinner color="gray" />
                            ) : (
                                <Check
                                    size={18}
                                    color={name === originalName ? '#9CA3AF' : 'green'}
                                />
                            )}
                        </Pressable>

                        <Pressable
                            disabled={name === originalName}
                            className={`p-2 border-x border-b rounded-br-lg border-inputBorder
                                        ${name === originalName ? 'opacity-40' : 'active:opacity-70'}`}
                            onPress={() => setName(originalName)}
                        >
                            <X
                                size={18}
                                color={name === originalName ? '#9CA3AF' : Colors.status.danger}
                            />
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
                        <Pressable
                            disabled={description === originalDescription}
                            className={`p-2 border-x border-b rounded-bl-lg border-inputBorder 
                                        ${description === originalDescription ? 'opacity-40' : ''}`}
                            onPress={() => handleUpdateProject('desciption')}
                        >
                            {updateDescriptionLoading ? (
                                <ButtonSpinner color="gray" />
                            ) : (
                                <Check
                                    size={18}
                                    color={description === originalDescription ? '#9CA3AF' : 'green'}
                                />
                            )}

                        </Pressable>

                        <Pressable
                            disabled={description === originalDescription}
                            className={`p-2 border-x border-b rounded-br-lg border-inputBorder
                                ${description === originalDescription ? 'opacity-40' : 'active:opacity-70'}`}
                            onPress={() => setDescription(originalDescription)}
                        >
                            <X
                                size={18}
                                color={description === originalDescription ? '#9CA3AF' : Colors.status.danger}
                            />
                        </Pressable>
                    </Box>
                </Box>
            </>}
        </Box>
    );
}
