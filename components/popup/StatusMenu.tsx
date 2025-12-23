import {
    CalendarDaysIcon,
    CheckCircleIcon,
    ClockIcon,
    CloseCircleIcon,
    EyeIcon,
    Icon,
    PlayIcon
} from '@/components/ui/icon';
import { Menu, MenuItem, MenuItemLabel, MenuSeparator } from '@/components/ui/menu';
import React from 'react';
import { Pressable } from 'react-native';
import { Box } from '../ui/box';
import { Text } from '../ui/text';

type Props = {
    status: string;
    setStatus: React.Dispatch<React.SetStateAction<string>>;
}

const STATUS_OPTIONS = [
    {
        label: "In Comming",
        icon: CalendarDaysIcon,
    },
    {
        label: "In Progress",
        icon: PlayIcon,
    },
    {
        label: "In Reviewed",
        icon: EyeIcon,
    },
    {
        label: "Done",
        icon: CheckCircleIcon,
    },
    {
        label: "Rejected",
        icon: CloseCircleIcon,
    },
    {
        label: "Over Due",
        icon: ClockIcon,
    },
];

export default function StatusMenu({ status, setStatus }: Props) {
    return (
        <Menu
            placement="bottom left"
            offset={5}
            disabledKeys={['Settings']}
            onSelectionChange={(keys) => {
                const value = Array.from(keys)[0] as string;
                setStatus(value);
            }}
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
                                {status}
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
                        onPress={() => setStatus(item.label)}
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
