import React, { useState } from 'react';

import { assignTask } from '@/api/tasks';
import { Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader } from "@/components/ui/modal";
import { ProjectMembers } from '@/utils/workType';
import { Search } from 'lucide-react-native';
import AssigneeCard from '../card/AssigneeCard';
import { Box } from '../ui/box';
import { Button, ButtonIcon, ButtonSpinner, ButtonText } from '../ui/button';
import { Heading } from '../ui/heading';
import { CheckIcon, CloseIcon, Icon } from '../ui/icon';
import { Input, InputField, InputIcon, InputSlot } from '../ui/input';
import { Toast, ToastDescription, ToastTitle, useToast } from '../ui/toast';

type Props = {
    showEditAssigneeModal: boolean;
    setShowEditAssigneeModal: React.Dispatch<React.SetStateAction<boolean>>;
    assigneeList: ProjectMembers[];
    taskId: string;
    projectId: string;
    reloadTask: (force?: boolean) => void;
};

type ToastType = "error" | "warning" | "success" | "info" | "muted" | undefined;

export default function EditAssignee(
    { showEditAssigneeModal, setShowEditAssigneeModal, assigneeList, taskId, reloadTask, projectId }: Props
) {
    const [search, setSearch] = useState("");

    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSelectMember = (uid: string) => {
        const isInList = selectedMembers.includes(uid);
        if (isInList) {
            setSelectedMembers(prev => prev.filter(id => id !== uid));
        } else {
            setSelectedMembers(prev => [...prev, uid]);
        }
    }

    const handleSaveAssignee = async () => {
        try {
            setLoading(true);
            const res = await assignTask(selectedMembers, projectId, taskId);
            handleToast("success", "Assign task!", "Assign task successfully.")
            reloadTask(true);
            setShowEditAssigneeModal(false);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
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

    return (
        <Modal
            isOpen={showEditAssigneeModal}
            onClose={() => {
                setShowEditAssigneeModal(false);
            }}
            size="full"
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
                                value={search}
                                onChangeText={setSearch}
                                placeholder="Search user..."
                                className="pl-2 text-darkTextPrimary"
                            />
                        </Input>
                    </Box>
                    <Box className='mt-4 -mx-6'>
                        {assigneeList.map(user => (
                            <AssigneeCard key={user.uid} name={user.email} uid={user.uid} onSelected={() => handleSelectMember(user.uid)} selected={selectedMembers.includes(user.uid)}
                                taskId={taskId} projectId={projectId} />
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
                            handleSaveAssignee();
                        }}
                    >
                        {loading ?
                            (<ButtonSpinner color="gray" />) :
                            (<ButtonIcon className='text-white font-bold text-xl' as={CheckIcon} />)
                        }
                        <ButtonText className="text-white">Save</ButtonText>
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal >
    )
}
