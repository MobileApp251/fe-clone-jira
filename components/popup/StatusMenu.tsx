import {
    AlertCircleIcon,
    CheckCircleIcon,
    Icon,
    PlayIcon,
    RemoveIcon,
    RepeatIcon
} from '@/components/ui/icon';
import { Menu, MenuItem, MenuItemLabel, MenuSeparator } from '@/components/ui/menu';
import React from 'react';
import { Pressable } from 'react-native';
import { Box } from '../ui/box';
import { Text } from '../ui/text';

type Props = {
    status: string;
    setStatus: React.Dispatch<React.SetStateAction<string>>;
    setOnUpdate: React.Dispatch<React.SetStateAction<boolean>>;
}

const STATUS_OPTIONS = [
    {
        label: "Open",
        value: "open",
        icon: AlertCircleIcon,
    },
    {
        label: "In Progress",
        value: "progress",
        icon: PlayIcon,
    },
    {
        label: "Done",
        value: "done",
        icon: CheckCircleIcon,
    },
    {
        label: "Reopen",
        value: "reopen",
        icon: RepeatIcon,
    },
    {
        label: "Close",
        value: "close",
        icon: RemoveIcon,
    },
];

export default function StatusMenu({ status, setStatus, setOnUpdate }: Props) {
    return (
        <Menu
            placement="bottom left"
            offset={5}
            disabledKeys={['Settings']}
            onSelectionChange={(keys) => {
                const value = Array.from(keys)[0] as string;
                setStatus(value);
                setOnUpdate(prev => !prev);
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
                        onPress={() => {
                            setStatus(item.value);
                            setOnUpdate(prev => !prev);
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
