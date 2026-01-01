import React, { useState } from 'react';

import { deleteTask } from '@/api/tasks';
import { Modal, ModalBackdrop, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@/components/ui/modal";
import { useProjects } from '@/context/ProjectsContext';
import { useRouter } from 'expo-router';
import { Box } from '../ui/box';
import { Button, ButtonIcon, ButtonSpinner, ButtonText } from '../ui/button';
import { Heading } from '../ui/heading';
import { CheckIcon, CloseIcon, Icon, TrashIcon } from '../ui/icon';
import { Text } from '../ui/text';
import { Toast, ToastDescription, ToastTitle, useToast } from '../ui/toast';

type Props = {
    showDeleteModal: boolean;
    setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
    title: string | undefined;
    projectId: string;
    taskId: string;
    onDeleted?: () => void;
    onTaskDetail?: boolean;
};

type ToastType = "error" | "warning" | "success" | "info" | "muted" | undefined;

export default function DeleteTask(
    { showDeleteModal, setShowDeleteModal, title, projectId, taskId, onDeleted, onTaskDetail = false }: Props
) {
    const router = useRouter();
    const { projectTasks, removeTask } = useProjects();
    const [loading, setLoading] = useState(false);
    const handleDeleteTask = async () => {
        let res = "";
        try {
            setLoading(true);
            console.log(projectTasks)
            res = await deleteTask(projectId, taskId);
            setShowDeleteModal(false);
            removeTask(taskId);
            if (onTaskDetail) {
                setTimeout(() => {
                    router.replace({
                        pathname: "/dashboard/projects/[id]",
                        params: {
                            id: projectId,
                            actionTaskId: taskId
                        },
                    });
                }, 3000);
            }
        } catch (e) {
            console.log("Delete failed:", e);
        } finally {
            setShowDeleteModal(false);
            handleToast("success", "Delete project task!", res);
            setLoading(false);
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
        <Modal
            isOpen={showDeleteModal}
            onClose={() => {
                setShowDeleteModal(false);
            }}
            size="md"
        >
            <ModalBackdrop />
            <ModalContent className="max-w-[305px] bg-white items-center">
                <ModalHeader>
                    <ModalHeader>
                        <Box className="w-[56px] h-[56px] rounded-full bg-red-100 items-center justify-center">
                            <Icon as={TrashIcon} className="stroke-error-600" size="xl" />
                        </Box>
                    </ModalHeader>
                </ModalHeader>
                <ModalBody className="mt-0 mb-4">
                    <Heading size="md" className="text-bold mb-2 text-center">
                        Delete project task
                    </Heading>
                    <Text size="sm" className="text-typography-500 text-center">
                        Are you sure you want to delete task <Text size="sm" className="text-typography-500 font-bold text-center">{title}</Text>? This action cannot be
                        undone.
                    </Text>
                </ModalBody>
                <ModalFooter className="w-full justify-between">
                    <Button
                        variant="outline"
                        action="negative"
                        className="mr-3"
                        onPress={() => {
                            setShowDeleteModal(false);
                        }}
                    >
                        <ButtonIcon className='text-red-500 font-bold text-xl' as={CloseIcon} />
                        <ButtonText className="text-red-500">Cancel</ButtonText>
                    </Button>
                    <Button
                        action="positive"
                        onPress={handleDeleteTask}
                    >
                        {loading ? (<ButtonSpinner color="gray" />) : (<ButtonIcon className='text-white font-bold text-xl' as={CheckIcon} />)}
                        <ButtonText className="text-white">Delete</ButtonText>
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
