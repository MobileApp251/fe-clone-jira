import { fireEvent, render } from "@testing-library/react-native";
import { usePathname, useRouter } from "expo-router";
import React from "react";
import WorkSwitch from "./WorkSwitch";

// Mock expo-router hooks
jest.mock("expo-router", () => ({
    useRouter: jest.fn(),
    usePathname: jest.fn(),
}));

describe("WorkSwitch component", () => {
    const pushMock = jest.fn();

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
        pushMock.mockClear();
    });

    it("renders Projects tab as active when pathname is /dashboard/projects", () => {
        (usePathname as jest.Mock).mockReturnValue("/dashboard/projects");

        const { getByText } = render(<WorkSwitch />);

        const projectsTab = getByText("My projects");
        const tasksTab = getByText("My tasks");

        // Pressing the tasks tab should navigate
        fireEvent.press(tasksTab);
        expect(pushMock).toHaveBeenCalledWith("/dashboard/tasks");
    });

    it("renders Tasks tab as active when pathname is /dashboard/tasks", () => {
        (usePathname as jest.Mock).mockReturnValue("/dashboard/tasks");

        const { getByText } = render(<WorkSwitch />);

        const projectsTab = getByText("My projects");
        const tasksTab = getByText("My tasks");

        // Pressing the projects tab should navigate
        fireEvent.press(projectsTab);
        expect(pushMock).toHaveBeenCalledWith("/dashboard/projects");
    });

    it("does not navigate when pressing the active tab", () => {
        (usePathname as jest.Mock).mockReturnValue("/dashboard/projects");

        const { getByText } = render(<WorkSwitch />);
        const projectsTab = getByText("My projects");

        fireEvent.press(projectsTab);
        expect(pushMock).not.toHaveBeenCalled();
    });
});
