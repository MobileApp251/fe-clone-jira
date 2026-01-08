import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import AssigneeCard from '../card/AssigneeCard';

// Mock UnassignTask
jest.mock('../popup/UnassignTask', () => {
    const React = require('react');
    const { View, Text } = require('react-native');

    return ({ showDeleteModal }: any) =>
        showDeleteModal ? (
            <View testID="unassign-task-modal">
                <Text>Unassign Task</Text>
            </View>
        ) : null;
});

describe('AssigneeCard', () => {
    const defaultProps = {
        name: 'John Doe',
        uid: 'user-123',
        taskId: 'task-1',
        projectId: 'project-1',
    };

    it('renders name correctly', () => {
        const { getByText } = render(<AssigneeCard {...defaultProps} />);
        expect(getByText('John Doe')).toBeTruthy();
    });

    it('renders checkbox when onSelected prop exists', () => {
        const onSelectedMock = jest.fn();
        const { getByTestId } = render(
            <AssigneeCard {...defaultProps} onSelected={onSelectedMock} selected={false} />
        );

        const checkbox = getByTestId('assignee-checkbox');
        expect(checkbox).toBeTruthy();
    });

    it('calls onSelected when checkbox is pressed', () => {
        const onSelectedMock = jest.fn();
        const { getByTestId } = render(
            <AssigneeCard {...defaultProps} onSelected={onSelectedMock} selected={false} />
        );

        const checkbox = getByTestId('assignee-checkbox');
        fireEvent.press(checkbox);

        expect(onSelectedMock).toHaveBeenCalledWith('user-123');
    });

    it('checkbox shows selected state', () => {
        const onSelectedMock = jest.fn();
        const { getByTestId } = render(
            <AssigneeCard {...defaultProps} onSelected={onSelectedMock} selected={true} />
        );

        const checkbox = getByTestId('assignee-checkbox');
        // kiểm tra style hoặc presence indicator cho selected
        expect(checkbox.props.children).not.toBeNull(); // có Check icon render
    });

    it('renders delete button when onSelected is undefined', () => {
        const { getByTestId } = render(<AssigneeCard {...defaultProps} />);
        const deleteButton = getByTestId('assignee-delete-button');
        expect(deleteButton).toBeTruthy();
    });

    it('opens UnassignTask modal when delete button is pressed', () => {
        const { getByTestId, queryByTestId } = render(<AssigneeCard {...defaultProps} />);

        // Ban đầu modal không hiển thị
        expect(queryByTestId('unassign-task-modal')).toBeNull();

        const deleteButton = getByTestId('assignee-delete-button');
        fireEvent.press(deleteButton);

        // Modal hiển thị sau khi nhấn nút
        expect(getByTestId('unassign-task-modal')).toBeTruthy();
    });
});