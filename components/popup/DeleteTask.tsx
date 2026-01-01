import React from 'react';

import { deleteTask } from '@/api/tasks';
import { Modal, ModalBackdrop, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@/components/ui/modal";
import { Box } from '../ui/box';
import { Button, ButtonIcon, ButtonText } from '../ui/button';
import { Heading } from '../ui/heading';
import { CheckIcon, CloseIcon, Icon, TrashIcon } from '../ui/icon';
import { Text } from '../ui/text';

type Props = {
    showDeleteModal: boolean;
    setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
    title: string | undefined;
    projectId: string;
    taskId: string;
    onDeleted?: () => void;
};


export default function DeleteTask(
    { showDeleteModal, setShowDeleteModal, title, projectId, taskId, onDeleted }: Props
) {
    const handleDeleteTask = async () => {
        try {
            await deleteTask(projectId, taskId);

            setShowDeleteModal(false);

            onDeleted && onDeleted();   // refresh danh sách
        } catch (e) {
            console.log("Delete failed:", e);
        }
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
                    <Heading size="md" className="text-bold mb-2 justify-center">
                        Delete project task
                    </Heading>
                    <Text size="sm" className="text-typography-500 text-center">
                        Are you sure you want to delete this task? This action cannot be
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
                        <ButtonIcon className='text-white font-bold text-xl' as={CheckIcon} />
                        <ButtonText className="text-white">Delete</ButtonText>
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
