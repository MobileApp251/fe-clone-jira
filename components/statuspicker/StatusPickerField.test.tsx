import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import StatusPickerField from './StatusPickerField';

describe('StatusPickerField', () => {
    it('renders placeholder when value is undefined', () => {
        const { getByText } = render(<StatusPickerField />);
        expect(getByText('Select status')).toBeTruthy();
    });

    it('renders current value when provided', () => {
        const { getByText } = render(<StatusPickerField value="progress" />);
        expect(getByText('progress')).toBeTruthy();
    });

    it('opens modal when press main button', () => {
        const { getByText, getAllByText } = render(<StatusPickerField />);
        const button = getByText('Select status');
        fireEvent.press(button);

        // Modal nội dung sẽ xuất hiện
        const headers = getAllByText('Select status');
        expect(headers.length).toBeGreaterThanOrEqual(2);
        expect(getByText('open')).toBeTruthy();
        expect(getByText('progress')).toBeTruthy();
        expect(getByText('done')).toBeTruthy();
    });

    it('calls onChange and closes modal when option pressed', async () => {
        const onChangeMock = jest.fn();
        const { getByText, queryByText } = render(
            <StatusPickerField value="open" onChange={onChangeMock} />
        );

        // mở modal
        fireEvent.press(getByText('open'));

        // chọn option 'done'
        fireEvent.press(getByText('done'));

        // onChange được gọi
        expect(onChangeMock).toHaveBeenCalledWith('done');

        // modal đã đóng → các option không còn render
        await waitFor(() => {
            expect(queryByText('done')).toBeNull();
        });
    });

    it('calls onClose when overlay pressed', () => {
        const { getByText, getByTestId } = render(
            <StatusPickerField onChange={jest.fn()} />
        );

        // mở modal
        fireEvent.press(getByText('Select status'));

        // nhấn overlay
        fireEvent.press(getByTestId('status-overlay'));

    });
});
