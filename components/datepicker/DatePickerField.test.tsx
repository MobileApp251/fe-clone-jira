import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import DatePickerField from "./DatePickerField";

jest.mock("react-native-ui-datepicker", () => {
    const { Text } = require("react-native");
    const React = require("react");
    return {
        __esModule: true,
        default: ({ onChange }: any) => {
            return <React.Fragment><Text testID="datepicker" onPress={() => onChange({ date: new Date("2026-01-20") })}>DatePicker</Text></React.Fragment>;
        },
        useDefaultClassNames: () => ({
            day: "day",
            today: "today",
            today_label: "today_label",
            selected: "selected",
            selected_label: "selected_label",
            day_label: "day_label",
            disabled: "disabled",
            button_next: "button_next",
            button_prev: "button_prev",
        }),
    };
});

describe("DatePickerField", () => {
    const mockSetDate = jest.fn();
    const mockSetUpdateDate = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders label if provided", () => {
        const { getByText } = render(
            <DatePickerField date={new Date()} setDate={mockSetDate} label="Due Date" />
        );

        expect(getByText("Due Date")).toBeTruthy();
    });

    it("renders placeholder if date is not provided", () => {
        const { getByText } = render(
            <DatePickerField setDate={mockSetDate} />
        );

        expect(getByText("MM/DD/YYYY")).toBeTruthy();
    });

    it("renders date if provided", () => {
        const testDate = new Date("2026-01-10");
        const { getByText } = render(
            <DatePickerField date={testDate} setDate={mockSetDate} />
        );

        expect(getByText("1/10/2026")).toBeTruthy(); // locale US format
    });

    it("opens and closes modal correctly", () => {
        const { getByText, queryByText } = render(
            <DatePickerField setDate={mockSetDate} />
        );

        // Modal chưa mở
        expect(queryByText("OK")).toBeNull();

        // Nhấn vào Pressable mở modal
        fireEvent.press(getByText("MM/DD/YYYY"));
        expect(getByText("OK")).toBeTruthy();
        expect(getByText("Cancel")).toBeTruthy();

        // Nhấn Cancel đóng modal
        fireEvent.press(getByText("Cancel"));
        expect(queryByText("OK")).toBeNull();
    });

    it("sets date and calls setUpdateDate on OK", () => {
        const testDate = new Date("2026-01-10");
        const { getByText } = render(
            <DatePickerField
                date={testDate}
                setDate={mockSetDate}
                setUpdateDate={mockSetUpdateDate}
            />
        );

        // Mở modal
        fireEvent.press(getByText("1/10/2026"));

        // Mô phỏng chọn date
        // Chúng ta không cần simulate DatePicker change chi tiết vì component từ lib
        // Gọi OK sẽ set date = tempDate = hiện tại (undefined), test logic OK button
        fireEvent.press(getByText("OK"));

        expect(mockSetDate).toHaveBeenCalled();
        expect(mockSetUpdateDate).toHaveBeenCalledWith(true);
    });

    it("respects minDate and maxDate props", () => {
        const minDate = new Date("2026-01-01");
        const maxDate = new Date("2026-01-31");
        const { getByText } = render(<DatePickerField setDate={mockSetDate} minDate={minDate} maxDate={maxDate} />);

        fireEvent.press(getByText("MM/DD/YYYY"));

        // Test date picker vẫn render
        expect(getByText("DatePicker")).toBeTruthy();
    });

    it("sets tempDate to current date on Cancel button press", () => {
        const initialDate = new Date("2026-01-10");
        const { getByText } = render(<DatePickerField date={initialDate} setDate={mockSetDate} />);

        // Mở modal
        fireEvent.press(getByText("1/10/2026"));

        // Chọn date mới
        fireEvent.press(getByText("DatePicker"));

        // Nhấn Cancel, tempDate reset
        fireEvent.press(getByText("Cancel"));

        // Mở modal lại, OK sẽ setDate = original date
        fireEvent.press(getByText("1/10/2026"));
        fireEvent.press(getByText("OK"));

        expect(mockSetDate).toHaveBeenCalledWith(initialDate);
    });
});
