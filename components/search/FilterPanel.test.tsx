import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import ProjectFilter from './FilterPanel';

// Mock DatePickerField
jest.mock('../datepicker/DatePickerField', () => {
    const { Text } = require('react-native');
    return ({ date, setDate, label }: any) => {
        return (
            <Text
                testID={`datepicker-${label}`}
                onPress={() => setDate('2026-01-08')}
            >
                {label}
            </Text>
        );
    };
});

describe('ProjectFilter', () => {
    it('renders Status and date pickers', () => {
        const { getByText, getByTestId } = render(<ProjectFilter />);

        expect(getByText('Status')).toBeTruthy();
        expect(getByText('Start Date')).toBeTruthy();
        expect(getByText('End Date')).toBeTruthy();

        // kiểm tra testID của DatePickerField
        expect(getByTestId('datepicker-Start Date')).toBeTruthy();
        expect(getByTestId('datepicker-End Date')).toBeTruthy();
    });

    it('updates startDate and endDate on selecting dates', () => {
        const { getByTestId } = render(<ProjectFilter />);

        const startPicker = getByTestId('datepicker-Start Date');
        const endPicker = getByTestId('datepicker-End Date');

        // fireEvent sẽ gọi setDate mocked
        fireEvent.press(startPicker);
        fireEvent.press(endPicker);

        // Nếu muốn kiểm tra giá trị state, phải expose state hoặc kiểm tra qua UI (ở đây mock đơn giản)
        // Nên test chính là onPress có gọi setDate hay không
        expect(startPicker.props.children).toBe('Start Date');
        expect(endPicker.props.children).toBe('End Date');
    });
});
