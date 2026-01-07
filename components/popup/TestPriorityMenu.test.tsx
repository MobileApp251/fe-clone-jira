// TaskPriorityMenu.test.tsx
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import TaskPriorityMenu from './TaskPriorityMenu';

jest.mock('@/components/ui/menu', () => {
    const { Pressable, Text } = require('react-native');

    return {
        Menu: ({ children, trigger }: any) => (
            <>
                {trigger({})}   {/* render trigger */}
                {children}      {/* render children ngay lập tức */}
            </>
        ),
        MenuItem: ({ onPress, children, testID }: any) => (
            <Pressable testID={testID} onPress={onPress}>
                {children}
            </Pressable>
        ),
        MenuItemLabel: ({ children }: any) => <Text>{children}</Text>,
        MenuSeparator: () => null,
    };
});

describe('TaskPriorityMenu Component', () => {
    const mockSetPriority = jest.fn();
    const mockSetOnUpdate = jest.fn();

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders trigger with current priority', () => {
        const { getByText } = render(
            <TaskPriorityMenu
                priority="low"
                setPriority={mockSetPriority}
                setOnUpdate={mockSetOnUpdate}
            />
        );

        // trigger hiển thị priority hiện tại
        expect(getByText('Low')).toBeTruthy();
        expect(getByText('Priority')).toBeTruthy();
    });

    it('pressing each priority calls setPriority and setOnUpdate', () => {
        const { getByText } = render(
            <TaskPriorityMenu
                priority="low"
                setPriority={mockSetPriority}
                setOnUpdate={mockSetOnUpdate}
            />
        );

        const priorities = [
            { label: 'Low', value: 'low' },
            { label: 'High', value: 'high' },
            { label: 'Medium', value: 'medium' },
        ];

        priorities.forEach(({ label, value }) => {
            // Tìm MenuItem bằng label (text hiển thị)
            const option = getByText(label);
            fireEvent.press(option);

            // Kiểm tra setPriority được gọi với value
            expect(mockSetPriority).toHaveBeenCalledWith(value);
            expect(mockSetOnUpdate).toHaveBeenCalled();
            jest.clearAllMocks();
        });
    });
});
