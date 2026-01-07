import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import ProjectCard from "./ProjectCard";

// Mock DeleteProject để tránh render modal thực tế
jest.mock("../popup/DeleteProject", () => {
    const React = require("react");
    const { Text, View } = require("react-native");

    return ({ showDeleteModal }: { showDeleteModal: boolean }) => {
        return showDeleteModal ? <View><Text>Delete Modal Open</Text></View> : null;
    };
});

jest.mock("react-native-gesture-handler/ReanimatedSwipeable", () => {
    const React = require("react");
    return ({ children, renderRightActions }: any) => (
        <>
            {children}
            {renderRightActions && renderRightActions()}
        </>
    );
});

jest.mock("@/utils/projectStatus", () => {
    const React = require("react");
    const { Text } = require("react-native");

    const MockIcon = () => <Text>Icon</Text>;
    return {
        PROJECT_STATUS_STYLE: {
            Pending: { text: "black", iconColor: "gray", icon: MockIcon },
            IN_PROGRESS: { text: "black", iconColor: "gray", icon: MockIcon },
        },
    };
});

describe("ProjectCard", () => {
    const props = {
        title: "Project A",
        description: "This is a test project",
        members: 5,
        status: "IN_PROGRESS",
        endDate: "2026-01-10",
        projectId: "1",
    };

    it("renders title, description, members, status, endDate", () => {
        const { getByText } = render(<ProjectCard {...props} />);

        expect(getByText("Project A")).toBeTruthy();
        expect(getByText("This is a test project")).toBeTruthy();
        expect(getByText("5")).toBeTruthy();
        expect(getByText("IN_PROGRESS")).toBeTruthy();
        expect(getByText("End date: 2026-01-10")).toBeTruthy();
    });

    it("opens DeleteProject modal when delete button pressed", () => {
        const { getByText } = render(<ProjectCard {...props} />);

        // Nhấn nút Delete (trên Swipeable)
        const deleteButton = getByText("Delete");
        fireEvent.press(deleteButton);

        // Kiểm tra modal hiển thị
        expect(getByText("Delete Modal Open")).toBeTruthy();
    });

    it("uses fallback style if status not in PROJECT_STATUS_STYLE", () => {
        const { getByText } = render(
            <ProjectCard {...props} status="UNKNOWN_STATUS" />
        );
        // Fallback text is "Pending"
        expect(getByText("UNKNOWN_STATUS")).toBeTruthy();
        expect(getByText("Icon")).toBeTruthy();
    });
});
