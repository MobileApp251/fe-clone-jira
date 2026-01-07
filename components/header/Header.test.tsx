import { getUserNotifications } from "@/api/users";
import { getUserProfile } from "@/auth/sign-in";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import Header from "./Header";

// Mock APIs
jest.mock('@/api/users', () => ({
    getUserProfile: jest.fn(),
    getUserNotifications: jest.fn(),
}));

jest.mock('@/auth/sign-in', () => ({
    getUserProfile: jest.fn(),
}));

// Mock router
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
    useRouter: () => ({ push: mockPush }),
    usePathname: () => "/home",
}));

jest.mock('@gluestack-ui/themed', () => {
    const React = require('react');
    const { View, Text } = require('react-native');
    return {
        Avatar: ({ children }: any) => <View>{children}</View>,
        AvatarImage: ({ source, alt }: any) => <Text>{alt}</Text>,
        Text: ({ children, ...props }: any) => <Text {...props}>{children}</Text>,
    };
});

describe("Header component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders User icon if no avatar", () => {
        const { getByTestId } = render(<Header />);

        const avatarButton = getByTestId("avatar-button");
        expect(avatarButton).toBeTruthy();
    });

    it("calls router.push('/profile') when avatar pressed", async () => {
        (getUserProfile as jest.Mock).mockResolvedValue({ email: "test@test.com", uid: "123", username: "Tester" });
        (getUserNotifications as jest.Mock).mockResolvedValue([]);

        const { getByTestId } = render(<Header />);
        const avatarButton = getByTestId("avatar-button");
        fireEvent.press(avatarButton);
        expect(mockPush).toHaveBeenCalledWith("/profile");
    });

    it("displays notification badge correctly", async () => {
        (getUserProfile as jest.Mock).mockResolvedValue({ email: "test@test.com", uid: "123", username: "Tester" });
        (getUserNotifications as jest.Mock).mockResolvedValue(Array(5));

        const { getByText } = render(<Header />);

        await waitFor(() => {
            expect(getByText("5")).toBeTruthy();
        });
    });

    it("caps notification badge at 9+", async () => {
        (getUserProfile as jest.Mock).mockResolvedValue({ email: "test@test.com", uid: "123", username: "Tester" });
        (getUserNotifications as jest.Mock).mockResolvedValue(Array(12));

        const { getByText } = render(<Header />);

        await waitFor(() => {
            expect(getByText("9+")).toBeTruthy();
        });
    });

    it("navigates to /notification on bell press if not already there", async () => {
        (getUserProfile as jest.Mock).mockResolvedValue({ email: "test@test.com", uid: "123", username: "Tester" });
        (getUserNotifications as jest.Mock).mockResolvedValue([]);

        const { getByTestId } = render(<Header />);
        const bellButton = getByTestId("bell-button");
        fireEvent.press(bellButton);
        expect(mockPush).toHaveBeenCalledWith("/notification");
        fireEvent.press(bellButton);
        expect(mockPush).toHaveBeenCalledWith("/notification");
    });

});
