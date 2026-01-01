import {
    CalendarDaysIcon,
    EyeIcon,
    PlayIcon
} from '@/components/ui/icon';
import { Menu, MenuItem, MenuItemLabel, MenuSeparator } from '@/components/ui/menu';
import { TaskPriority } from '@/utils/taskStatus';
import React from 'react';
import { Pressable } from 'react-native';
import { Box } from '../ui/box';
import { Text } from '../ui/text';

type Props = {
    priority: string;
    setPriority: React.Dispatch<React.SetStateAction<TaskPriority>>;
    setOnUpdate: React.Dispatch<React.SetStateAction<boolean>>;
}

const PRIORITY_OPTIONS = [
    {
        label: "Low",
        value: "low",
        icon: CalendarDaysIcon,
    },
    {
        label: "High",
        value: "high",
        icon: PlayIcon,
    },
    {
        label: "Medium",
        value: "medium",
        icon: EyeIcon,
    }
];

export default function TaskPriorityMenu({ priority, setPriority, setOnUpdate }: Props) {
    return (
        <Menu
            placement="bottom left"
            offset={5}
            className=' p-0 border-lightPrimary bg-white'
            trigger={({ ...triggerProps }) => {
                return (
                    <Box className="relative mb-5">
                        <Box className="absolute left-3 -top-2 px-1 z-10 bg-lightPrimaryLight">
                            <Text className="text-xs font-semibold text-blue-700">
                                Priority
                            </Text>
                        </Box>

                        <Pressable
                            {...triggerProps}
                            className="border border-lightPrimary rounded-lg px-3 py-3 flex-row items-center justify-between"
                        >
                            <Text className="text-lightPrimary">
                                {priority}
                            </Text>
                        </Pressable>
                    </Box>
                );
            }}
        >
            {PRIORITY_OPTIONS.map((item, index) => (
                <React.Fragment key={item.label}>
                    <MenuItem
                        className="bg-white"
                        textValue={item.label}
                        onPress={() => {
                            setPriority(item.value as TaskPriority);
                            setOnUpdate(prev => !prev);
                        }}
                    >
                        <MenuItemLabel size="sm" className="text-darkTextPrimary">
                            {item.label}
                        </MenuItemLabel>
                    </MenuItem>

                    {index < PRIORITY_OPTIONS.length - 1 && <MenuSeparator className='bg-lightPrimaryLight' />}
                </React.Fragment>
            ))}
        </Menu>
    );
}
