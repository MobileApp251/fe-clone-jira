import React from 'react';

import { Modal, ModalBackdrop, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@/components/ui/modal";
import { Button, ButtonIcon, ButtonText } from '../ui/button';
import { Heading } from '../ui/heading';
import { CheckIcon, CloseIcon } from '../ui/icon';
import { Text } from '../ui/text';

type Props = {
    showDeleteModal: boolean;
    setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
    title: string | undefined;
};


export default function DeleteTask(
    { showDeleteModal, setShowDeleteModal, title }: Props
) {
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
                <ModalFooter className="w-full">
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
                        onPress={() => {
                            setShowDeleteModal(false);
                        }}
                    >
                        <ButtonIcon className='text-white font-bold text-xl' as={CheckIcon} />
                        <ButtonText className="text-white">Delete</ButtonText>
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
