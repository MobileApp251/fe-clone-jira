import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import MemberCard from '../card/MemberCard';

// Mock RemoveMember modal
jest.mock('../popup/RemoveMember', () => {
    const React = require('react');
    const { View, Text } = require('react-native');

    return ({ showDeleteModal }: any) =>
        showDeleteModal ? (
            <View testID="remove-member-modal">
                <Text>Remove Member</Text>
            </View>
        ) : null;
});

describe('MemberCard', () => {
    const defaultProps = {
        id: 'user-123',
        name: 'John Doe',
        role: 'admin',
    };

    it('renders name and role correctly', () => {
        const { getByText } = render(<MemberCard {...defaultProps} />);
        expect(getByText('John Doe')).toBeTruthy();
        expect(getByText('Admin')).toBeTruthy();
    });

    it('renders checkbox when onSelected is provided', () => {
        const onSelectedMock = jest.fn();
        const { getByTestId } = render(
            <MemberCard {...defaultProps} onSelected={onSelectedMock} selected={false} />
        );

        const checkbox = getByTestId('checkbox');
        expect(checkbox).toBeTruthy();
    });

    it('calls onSelected when checkbox is pressed', () => {
        const onSelectedMock = jest.fn();
        const { getByTestId } = render(
            <MemberCard {...defaultProps} onSelected={onSelectedMock} selected={false} />
        );

        const checkbox = getByTestId('checkbox');
        fireEvent.press(checkbox);

        expect(onSelectedMock).toHaveBeenCalledWith('user-123');
    });

    it('checkbox shows selected state', () => {
        const onSelectedMock = jest.fn();
        const { getByTestId } = render(
            <MemberCard {...defaultProps} onSelected={onSelectedMock} selected={true} />
        );

        const checkbox = getByTestId('checkbox');
        expect(checkbox.props.children).not.toBeNull(); // check icon rendered
    });

    it('renders delete button when onSelected is undefined', () => {
        const { getByTestId } = render(<MemberCard {...defaultProps} />);
        const deleteButton = getByTestId('delete-button');
        expect(deleteButton).toBeTruthy();
    });

    it('opens RemoveMember modal when delete button is pressed', () => {
        const { getByTestId, queryByTestId } = render(<MemberCard {...defaultProps} />);

        // Ban đầu modal không hiển thị
        expect(queryByTestId('remove-member-modal')).toBeNull();

        const deleteButton = getByTestId('delete-button');
        fireEvent.press(deleteButton);

        // Modal hiển thị sau khi nhấn
        expect(getByTestId('remove-member-modal')).toBeTruthy();
    });
});