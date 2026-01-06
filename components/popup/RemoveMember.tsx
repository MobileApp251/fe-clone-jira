import React, { useState } from 'react';

import { removeMembers } from '@/api/projects';
import { Modal, ModalBackdrop, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@/components/ui/modal";
import { useProjects } from '@/context/ProjectsContext';
import { Box } from '../ui/box';
import { Button, ButtonIcon, ButtonSpinner, ButtonText } from '../ui/button';
import { Heading } from '../ui/heading';
import { CheckIcon, CloseIcon, Icon, TrashIcon } from '../ui/icon';
import { Text } from '../ui/text';
import { Toast, ToastDescription, ToastTitle, useToast } from '../ui/toast';

type Props = {
    showDeleteModal: boolean;
    setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
    userEmail: string | undefined;
    uid: string;
};

type ToastType = "error" | "warning" | "success" | "info" | "muted" | undefined;

export default function RemoveMember(
    { showDeleteModal, setShowDeleteModal, userEmail, uid }: Props
) {
    const { project, updateMembers } = useProjects();
    const [loading, setLoading] = useState(false);
    const handleDeleteTask = async () => {
        try {
            setLoading(true);
            const res = await removeMembers(project.project.proj_id, uid);
            updateMembers(project.project.proj_id);
            handleToast("success", "Remove member from project!", "A member have been removed successfully.")
        } catch (e) {
            console.log("Delete failed:", e);
        } finally {
            setShowDeleteModal(false);
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
                        Remove member
                    </Heading>
                    <Text size="sm" className="text-typography-500 text-center">
                        Are you sure you want to remove user <Text size="sm" className="text-typography-500 font-bold text-center">{userEmail}</Text>? This action cannot be
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
