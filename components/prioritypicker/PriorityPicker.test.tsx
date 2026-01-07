import { TaskPriority } from '@/utils/taskStatus';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import PriorityPicker from './PriorityPicker'; // chỉnh đường dẫn nếu cần

describe('PriorityPicker', () => {
    const PRIORITIES: TaskPriority[] = ['low', 'medium', 'high'];

    it('renders placeholder when no value is selected', () => {
        const { getByText } = render(<PriorityPicker />);
        expect(getByText('Select status')).toBeTruthy();
    });

    it('renders current value when provided', () => {
        const { getByText } = render(<PriorityPicker value="medium" />);
        expect(getByText('medium')).toBeTruthy();
    });

    it('opens modal when pressing the main button', () => {
        const { getByText, queryByText } = render(<PriorityPicker />);

        expect(queryByText('Select priority')).toBeNull(); // modal chưa mở
        fireEvent.press(getByText('Select status'));
        expect(getByText('Select priority')).toBeTruthy(); // modal mở
    });

    it('calls onChange and closes modal when selecting a priority', () => {
        const onChangeMock = jest.fn();
        const { getByText, queryByText } = render(
            <PriorityPicker value="low" onChange={onChangeMock} />
        );

        fireEvent.press(getByText('low')); // mở modal
        fireEvent.press(getByText('medium')); // chọn 'medium'

        expect(onChangeMock).toHaveBeenCalledWith('medium');
        expect(queryByText('Select priority')).toBeNull(); // modal đóng
    });

    it('shows check mark for current value', () => {
        const { getByText, getAllByTestId } = render(
            <PriorityPicker value="high" />
        );

        fireEvent.press(getByText('high')); // mở modal
        expect(getAllByTestId('check-icon').length).toBeGreaterThan(0);
    });
});
