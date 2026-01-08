import { updateProject } from "@/api/projects";
import { useProjects } from "@/context/ProjectsContext";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import { useToast } from "../ui/toast";
import MarkAsDone from "./MarkAsDone";

// Mock API
jest.mock("@/api/projects", () => ({
    updateProject: jest.fn(),
}));

// Mock context
jest.mock("@/context/ProjectsContext", () => ({
    useProjects: jest.fn(),
}));

// Mock useToast
jest.mock("../ui/toast", () => ({
    useToast: jest.fn(),
    Toast: ({ children }: any) => <>{children}</>,
    ToastTitle: ({ children }: any) => <>{children}</>,
    ToastDescription: ({ children }: any) => <>{children}</>,
}));

jest.mock('@/components/ui/menu', () => {
    const React = require('react');
    const { View, Text, Pressable } = require('react-native');
    return {
        Menu: ({ children, trigger }: any) => {
            // render trigger + children trực tiếp để test
            return (
                <View>
                    {trigger({ onPress: () => { } })}
                    {children}
                </View>
            );
        },
        MenuItem: ({ children, onPress }: any) => (
            <Pressable onPress={onPress}>
                <Text>{children}</Text>
            </Pressable>
        ),
        MenuItemLabel: ({ children }: any) => <Text>{children}</Text>,
        MenuSeparator: () => <View />,
    };
});

describe("MarkAsDone component", () => {
    const updateProjectByIdMock = jest.fn();
    const onChangeMock = jest.fn();
    const toastShowMock = jest.fn();

    beforeEach(() => {
        (useProjects as jest.Mock).mockReturnValue({
            updateProjectById: updateProjectByIdMock,
        });
        (useToast as jest.Mock).mockReturnValue({
            show: toastShowMock,
            isActive: jest.fn().mockReturnValue(false),
        });

        (updateProject as jest.Mock).mockClear();
        updateProjectByIdMock.mockClear();
        onChangeMock.mockClear();
        toastShowMock.mockClear();
    });

    it("renders current status correctly", () => {
        const { getAllByText } = render(
            <MarkAsDone projectId="1" value={true} onChange={onChangeMock} />
        );

        // Status đúng
        const doneTexts = getAllByText("Done");
        expect(doneTexts.length).toBeGreaterThan(0);
    });

    it("calls updateProject, updateProjectById, onChange and toast on status change", async () => {
        // Mock API trả về done toggle
        (updateProject as jest.Mock).mockResolvedValue({ done: false });

        const { getByText } = render(
            <MarkAsDone projectId="1" value={true} onChange={onChangeMock} />
        );

        // Nhấn "Not Done" trực tiếp
        fireEvent.press(getByText("Not Done"));
        await waitFor(() => {
            expect(updateProject).toHaveBeenCalledWith("1", { done: false });
            expect(updateProjectByIdMock).toHaveBeenCalledWith("1", { done: false });
            expect(onChangeMock).toHaveBeenCalled();
            expect(toastShowMock).toHaveBeenCalled();
        });
    });

    it("does not crash if updateProject throws", async () => {
        (updateProject as jest.Mock).mockRejectedValue(new Error("API error"));

        const { getByText, getAllByText } = render(
            <MarkAsDone projectId="1" value={true} onChange={onChangeMock} />
        );

        const doneTexts = getAllByText("Done");
        expect(doneTexts.length).toBeGreaterThan(0);

        fireEvent.press(getByText("Not Done"));

        await waitFor(() => {
            // test vẫn chạy, không throw
            expect(updateProject).toHaveBeenCalled();
        });
    });
});
