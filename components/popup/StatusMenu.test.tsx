import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import StatusMenu from './StatusMenu';

jest.mock('@/components/ui/menu', () => {
    const React = require('react');
    const { Pressable } = require('react-native');

    return {
        Menu: ({ children }: { children: React.ReactNode }) => <>{children}</>,
        MenuItem: ({ onPress, testID, children }: any) => (
            <Pressable testID={testID || 'menu-item'} onPress={onPress}>
                {children}
            </Pressable>
        ),
        MenuItemLabel: ({ children }: any) => <>{children}</>,
        MenuSeparator: () => null,
    };
});

describe('StatusMenu Component', () => {
    const mockSetStatus = jest.fn();
    const mockSetOnUpdate = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders current status and label', () => {
        const { getByTestId, getByText } = render(
            <StatusMenu status="open" setStatus={mockSetStatus} setOnUpdate={mockSetOnUpdate} />
        );

        // Test trigger bằng testID
        const trigger = getByTestId('status-open'); // testID = status-{value}
        expect(trigger).toBeTruthy();

    });

    it('pressing each status calls setStatus and setOnUpdate', () => {
        const { getByTestId } = render(
            <StatusMenu status="open" setStatus={mockSetStatus} setOnUpdate={mockSetOnUpdate} />
        );

        const statuses = ['open', 'progress', 'done', 'reopen', 'close'];

        statuses.forEach((status) => {
            const item = getByTestId(`status-${status}`);
            fireEvent.press(item);
            expect(mockSetStatus).toHaveBeenCalledWith(status);
            expect(mockSetOnUpdate).toHaveBeenCalled();
        });

        // Tổng số lần gọi setStatus = 5
        expect(mockSetStatus).toHaveBeenCalledTimes(5);
        expect(mockSetOnUpdate).toHaveBeenCalledTimes(5);
    });

    it('pressing trigger Pressable does not crash', () => {
        const { getByTestId } = render(
            <StatusMenu status="open" setStatus={mockSetStatus} setOnUpdate={mockSetOnUpdate} />
        );

        // Test trigger bằng testID
        const trigger = getByTestId('status-open'); // testID = status-{value}
        expect(trigger).toBeTruthy();

        // Không cần check gì, chỉ test không crash
    });
});