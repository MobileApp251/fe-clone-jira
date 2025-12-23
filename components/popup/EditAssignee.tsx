import React from 'react';

import { Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader } from "@/components/ui/modal";
import { Search } from 'lucide-react-native';
import AssigneeCard from '../card/AssigneeCard';
import { Box } from '../ui/box';
import { Button, ButtonIcon, ButtonText } from '../ui/button';
import { Heading } from '../ui/heading';
import { CheckIcon, CloseIcon, Icon } from '../ui/icon';
import { Input, InputField, InputIcon, InputSlot } from '../ui/input';

type Props = {
    showEditAssigneeModal: boolean;
    setShowEditAssigneeModal: React.Dispatch<React.SetStateAction<boolean>>;
    assigneeList: Assignee[];
};

type Assignee = {
    id: string;
    name: string;
}

export default function EditAssignee(
    { showEditAssigneeModal, setShowEditAssigneeModal, assigneeList }: Props
) {

    return (
        <Modal
            isOpen={showEditAssigneeModal}
            onClose={() => {
                setShowEditAssigneeModal(false);
            }}
            size="md"
        >
            <ModalBackdrop />
            <ModalContent className="bg-white -mt-96" >
                <ModalHeader>
                    <Heading className="text-darkTextPrimary" size="lg">Assignee</Heading>
                    <ModalCloseButton>
                        <Icon color="black" as={CloseIcon} />
                    </ModalCloseButton>
                </ModalHeader>
                <ModalBody>
                    <Box className="flex-1">
                        <Input
                            variant="outline"
                            size="lg"
                            className="h-12 rounded-lg border-lightBorder"
                        >
                            <InputSlot className="pl-3">
                                <InputIcon as={Search} />
                            </InputSlot>
                            <InputField
                                placeholder="Search user..."
                                className="pl-2 text-darkTextPrimary"
                            />
                        </Input>
                    </Box>
                    <Box className='mt-4'>
                        {assigneeList.map(user => (
                            <AssigneeCard key={user.id} name={user.name} />
                        ))}
                    </Box>

                </ModalBody>
                <ModalFooter>
                    <Button
                        variant="outline"
                        action="negative"
                        className="mr-3"
                        onPress={() => {
                            setShowEditAssigneeModal(false);
                        }}
                    >
                        <ButtonIcon className='text-red-500 font-bold text-xl' as={CloseIcon} />
                        <ButtonText className="text-red-500">Cancel</ButtonText>
                    </Button>
                    <Button
                        action="positive"
                        onPress={() => {
                            setShowEditAssigneeModal(false);
                        }}
                    >
                        <ButtonIcon className='text-white font-bold text-xl' as={CheckIcon} />
                        <ButtonText className="text-white">Save</ButtonText>
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
