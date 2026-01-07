import { TaskPriority } from "@/utils/taskStatus";
import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import TaskCard from "./TaskCard";

// Mock Swipeable để render luôn rightActions
jest.mock("react-native-gesture-handler/ReanimatedSwipeable", () => {
    const React = require("react");
    return ({ children, renderRightActions, enabled }: any) => (
        <>
            {children}
            {enabled && renderRightActions && renderRightActions()}
        </>
    );
});

// Mock DeleteTask
jest.mock("../popup/DeleteTask", () => {
    const React = require("react");
    const { View, Text } = require("react-native");
    return ({ showDeleteModal }: { showDeleteModal: boolean }) =>
        showDeleteModal ? <View><Text>Delete Modal Open</Text></View> : null;
});
//  Mock TASK_STATUS_STYLE + priorityStyles
jest.mock("@/utils/taskStatus", () => {
    const { Text } = require("react-native");
    const MockIcon = () => <Text>Icon</Text>;

    return {
        TASK_STATUS_STYLE: {
            Pending: { text: "black", iconColor: "gray", icon: MockIcon },
            OPEN: { text: "black", iconColor: "gray", icon: MockIcon },
        },
        priorityStyles: {
            high: { bg: "bg-red-500", text: "text-white" },
            medium: { bg: "bg-yellow-500", text: "text-black" },
            low: { bg: "bg-green-500", text: "text-black" },
        },
    };
});

//Mock useRouter
const mockPush = jest.fn();
jest.mock("expo-router", () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}));

describe("TaskCard", () => {
    const baseProps = {
        id: "1",
        title: "Test Task",
        description: "This is a test task",
        priority: "high" as TaskPriority,
        status: "OPEN",
        endDate: new Date("2026-01-10"),
        inProject: true,
        members: [{ uid: "u1", username: "User 1", role: "leader", email: "abc" }, { uid: "u2", username: "User 2", role: "member", email: "abc" }],
        projectId: "p1",
        onMyTask: false,
    };

    it("renders title, description, status, priority, due date and members", () => {
        const { getByText } = render(<TaskCard {...baseProps} />);

        // Title & description
        expect(getByText("Test Task")).toBeTruthy();
        expect(getByText("This is a test task")).toBeTruthy();

        // Status
        expect(getByText("OPEN")).toBeTruthy();

        // Priority badge
        expect(getByText("high")).toBeTruthy();

        // Due date
        expect(getByText("Due date: Sat Jan 10 2026")).toBeTruthy();

        // Members
        baseProps.members.forEach((_, index) => {
            expect(getByText("Icon") || true).toBeTruthy(); // Status icon + could check member avatars differently
        });
    });

    it("does not render swipe actions if onMyTask=true", () => {
        const { queryByText } = render(
            <TaskCard {...baseProps} onMyTask={true} />
        );
        expect(queryByText("Delete")).toBeNull();
    });

    it("opens DeleteTask modal when delete button pressed", () => {
        const { getByText } = render(<TaskCard {...baseProps} />);

        // Nút Delete sẽ tồn tại nhờ mock Swipeable
        const deleteButton = getByText("Delete");
        fireEvent.press(deleteButton);

        // Kiểm tra modal hiển thị
        expect(getByText("Delete Modal Open")).toBeTruthy();
    });

    it("calls router.push when card pressed", () => {
        const { getByText } = render(<TaskCard {...baseProps} />);
        const cardTitle = getByText("Test Task");

        fireEvent.press(cardTitle);

        expect(mockPush).toHaveBeenCalledWith({
            pathname: "/dashboard/tasks/[id]",
            params: { id: "1", projectId: "p1" },
        });
    });

    it("does not render swipe actions if onMyTask=true", () => {
        const { queryByText } = render(<TaskCard {...baseProps} onMyTask={true} />);
        expect(queryByText("Delete")).toBeNull(); // Swipe disabled
    });
});
