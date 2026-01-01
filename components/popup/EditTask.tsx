import { updateTask } from "@/api/tasks";
import { Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader } from "@/components/ui/modal";
import { TaskData } from "@/utils/workType";
import React, { useEffect, useRef } from 'react';
import { Button, ButtonIcon, ButtonText } from '../ui/button';
import { FormControl } from '../ui/form-control';
import { Heading } from '../ui/heading';
import { CheckIcon, CloseIcon, Icon } from '../ui/icon';
import { Input, InputField } from '../ui/input';
import { Text } from '../ui/text';
import { Textarea, TextareaInput } from '../ui/textarea';
import { VStack } from '../ui/vstack';

type Props = {
    showEditModal: boolean;
    setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
    title: string;
    setTitle: React.Dispatch<React.SetStateAction<string>>;
    description: string;
    setDescription: React.Dispatch<React.SetStateAction<string>>;
    projectId: string;
    taskId: string;
    task: TaskData;
    fetchTask: () => void;
};


export default function EditTask(
    { showEditModal, setShowEditModal, title, description, setTitle, setDescription, projectId, taskId, task, fetchTask }: Props
) {

    const initialTitle = useRef(title);
    const initialDescription = useRef(description);

    useEffect(() => {
        if (showEditModal) {
            initialTitle.current = title;
            initialDescription.current = description;
        }
    }, [description, showEditModal, title]);

    const handleCancelEdit = () => {
        setTitle(initialTitle.current);
        setDescription(initialDescription.current);
        setShowEditModal(false);
    };

    const handleSaveEdit = async () => {
        try {
            const res = await updateTask(projectId, taskId, { 
                task_name: title, 
                content: description, 
                priority: task.priority, 
                status: task.status,    
                startAt: task.startAt, 
                endAt: task.endAt });

            if (!res) {
                throw new Error("Update task failed");
            }

            setShowEditModal(false);
            fetchTask();
        } catch (e) {
            console.log(e);
        }
    };


    return (
        <Modal
            isOpen={showEditModal}
            onClose={() => {
                setShowEditModal(false);
            }}
            size="md"
        >
            <ModalBackdrop />
            <ModalContent className="bg-white -mt-96" >
                <ModalHeader>
                    <Heading className="text-darkTextPrimary" size="lg">Editing</Heading>
                    <ModalCloseButton>
                        <Icon color="black" as={CloseIcon} />
                    </ModalCloseButton>
                </ModalHeader>
                <ModalBody>
                    <FormControl className="border-none rounded-lg w-full">
                        <VStack className="gap-4">
                            <VStack space="xs">
                                <Text className="text-typography-500">Task name</Text>
                                <Input>
                                    <InputField className='text-darkTextPrimary' placeholder='Task name' type="text"
                                        value={title}
                                        onChangeText={setTitle} />
                                </Input>
                            </VStack>

                            <VStack space="xs">
                                <Text className="text-typography-500">Description</Text>
                                <Textarea
                                    size="md"
                                    isReadOnly={false}
                                    isInvalid={false}
                                    isDisabled={false}
                                >
                                    <TextareaInput className='text-darkTextPrimary' placeholder="Task descripiton"
                                        value={description}
                                        onChangeText={setDescription} />
                                </Textarea>
                            </VStack>
                        </VStack>
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Button
                        variant="outline"
                        action="negative"
                        className="mr-3"
                        onPress={() => {
                            handleCancelEdit();
                        }}
                    >
                        <ButtonIcon className='text-red-500 font-bold text-xl' as={CloseIcon} />
                        <ButtonText className="text-red-500">Cancel</ButtonText>
                    </Button>
                    <Button
                        action="positive"
                        onPress={handleSaveEdit}
                    >
                        <ButtonIcon className='text-white font-bold text-xl' as={CheckIcon} />
                        <ButtonText className="text-white">Save</ButtonText>
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
