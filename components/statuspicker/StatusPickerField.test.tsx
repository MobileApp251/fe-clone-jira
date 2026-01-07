// __tests__/StatusPickerField.test.tsx
import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import StatusPickerField from "./StatusPickerField";

/* =======================
   MOCKS
======================= */
jest.mock("lucide-react-native", () => ({
    Check: () => null,
    ChevronDown: () => null,
}));

jest.mock("@/constants/theme", () => ({
    Colors: {
        light: {
            primary: "#000",
        },
    },
}));

jest.mock("@/components/ui/text", () => ({
    Text: ({ children }: any) => children,
}));

describe("StatusPickerField", () => {
    it("opens modal when trigger is pressed", () => {
        const { getByTestId, queryAllByText } = render(<StatusPickerField />);

        fireEvent.press(getByTestId("status-picker-trigger"));

        expect(queryAllByText("Select status")).toBeTruthy();
        expect(queryAllByText("open")).toBeTruthy();
        expect(queryAllByText("progress")).toBeTruthy();
    });
        it("closes modal when backdrop is pressed", () => {
        const { getByTestId, queryByText } = render(<StatusPickerField />);

        fireEvent.press(getByTestId("status-picker-trigger"));
        fireEvent.press(getByTestId("status-picker-backdrop"));

        expect(queryByText("open")).toBeNull();
    });
        it("calls onChange with selected status and closes modal", () => {
        const onChange = jest.fn();

        const { getByTestId, queryByText } = render(
            <StatusPickerField onChange={onChange} />
        );

        fireEvent.press(getByTestId("status-picker-trigger"));
        fireEvent.press(getByTestId("status-option-done"));

        expect(onChange).toHaveBeenCalledWith("done");
        expect(queryByText("done")).toBeNull(); // modal đóng
    });
    it("shows selected value in trigger", () => {
        const { queryAllByText } = render(
            <StatusPickerField value="progress" />
        );

        expect(queryAllByText("progress")).toBeTruthy();
    });
});


