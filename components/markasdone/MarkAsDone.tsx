import { updateProject } from '@/api/projects';
import {
    CheckCircleIcon,
    CloseCircleIcon,
    Icon
} from '@/components/ui/icon';
import { Menu, MenuItem, MenuItemLabel, MenuSeparator } from '@/components/ui/menu';
import { useProjects } from '@/context/ProjectsContext';
import { UpdateProjectDTO } from '@/utils/workType';
import React, { useState } from 'react';
import { Pressable } from 'react-native';
import { Box } from '../ui/box';
import { Text } from '../ui/text';
import { Toast, ToastDescription, ToastTitle, useToast } from '../ui/toast';

type Props = {
    projectId: string;
    value: boolean;
    onChange: React.Dispatch<React.SetStateAction<boolean>>;
}

const STATUS_OPTIONS = [
    {
        label: "Done",
        icon: CheckCircleIcon,
        value: true,
    },
    {
        label: "Not Done",
        icon: CloseCircleIcon,
        value: false,
    }
];

type ToastType = "error" | "warning" | "success" | "info" | "muted" | undefined;

export default function MarkAsDone({ projectId, value, onChange }: Props) {
    const currentStatus = STATUS_OPTIONS.find(
        (item) => item.value === value
    );

    const { updateProjectById } = useProjects();

    const handleUpdateStatus = async () => {
        try {
            const payload: UpdateProjectDTO = {
                done: !value,
            }
            const res = await updateProject(projectId, payload);
            updateProjectById(projectId, res);
            onChange(prev => !prev);
            handleToast("success", "Edit project!", `Project has been marked as ${res.done ? "done" : "not done yet"}.`)
        } catch (error) {
            console.error(error)
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
        <Menu
            placement="bottom left"
            offset={5}
            className='p-0 border-lightPrimary bg-white'
            trigger={({ ...triggerProps }) => {
                return (
                    <Box className="relative mb-5">
                        <Box className="absolute left-3 -top-2 px-1 z-10 bg-lightPrimaryLight">
                            <Text className="text-xs font-semibold text-blue-700">
                                Status
                            </Text>
                        </Box>

                        <Pressable
                            {...triggerProps}
                            className="border border-lightPrimary rounded-lg px-3 py-3 flex-row items-center justify-between"
                        >
                            <Text className="text-lightPrimary">
                                {currentStatus?.label}
                            </Text>
                        </Pressable>
                    </Box>
                );
            }}
        >
            {STATUS_OPTIONS.map((item, index) => (
                <React.Fragment key={item.label}>
                    <MenuItem
                        className="bg-white"
                        textValue={item.label}
                        onPress={() => {
                            handleUpdateStatus();
                        }}
                    >
                        <Icon
                            as={item.icon}
                            size="sm"
                            className="mr-2 text-darkTextPrimary"
                        />
                        <MenuItemLabel size="sm" className="text-darkTextPrimary">
                            {item.label}
                        </MenuItemLabel>
                    </MenuItem>

                    {index < STATUS_OPTIONS.length - 1 && <MenuSeparator className='bg-lightPrimaryLight' />}
                </React.Fragment>
            ))}
        </Menu>
    );
}
