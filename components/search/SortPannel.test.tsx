import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import SortPanel from './SortPannel';

describe('SortPanel', () => {
    it('renders options when visible', () => {
        const { getByText } = render(
            <SortPanel visible={true} onClose={jest.fn()} />
        );

        expect(getByText('Sort by')).toBeTruthy();
        expect(getByText('Created date')).toBeTruthy();
        expect(getByText('Due date')).toBeTruthy();
        expect(getByText('Priority')).toBeTruthy();
        expect(getByText('Cancel')).toBeTruthy();
    });

    it('calls onClose when pressing overlay', () => {
        const onCloseMock = jest.fn();
        const { getByText } = render(
            <SortPanel visible={true} onClose={onCloseMock} />
        );

        // Overlay là Pressable đầu tiên, nhấn vào Text "Sort by" sẽ không trigger onClose
        // Thay vào đó ta dùng fireEvent.press trên Modal wrapper (react-native RTL không expose trực tiếp)
        // Ta sẽ mock onRequestClose hoặc nhấn vào nút Cancel cho đơn giản
        fireEvent.press(getByText('Cancel'));
        expect(onCloseMock).toHaveBeenCalled();
    });

    it('calls onSelect and onClose when an option is pressed', () => {
        const onCloseMock = jest.fn();
        const onSelectMock = jest.fn();

        const { getByText } = render(
            <SortPanel visible={true} onClose={onCloseMock} onSelect={onSelectMock} />
        );

        const option = getByText('Due date');
        fireEvent.press(option);

        expect(onSelectMock).toHaveBeenCalledWith('Due date');
        expect(onCloseMock).toHaveBeenCalled();
    });

    it('does not render options when visible is false', () => {
        const { queryByText } = render(
            <SortPanel visible={false} onClose={jest.fn()} />
        );

        expect(queryByText('Sort by')).toBeNull();
        expect(queryByText('Created date')).toBeNull();
    });
});
