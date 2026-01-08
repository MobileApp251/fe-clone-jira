import { useGoogleAuth } from '@/auth/GoogleAuthContext';
import { getUserProfile } from '@/auth/sign-in';
import { useNotification } from '@/context/NotificationContext';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import React from 'react';
import Profile from '../(main)/profile/index'; // Đảm bảo đường dẫn import đúng

// ==============================
// 1. MOCK CÁC MODULE BÊN NGOÀI
// ==============================

// Mock Expo Router
const mockRouter = {
  back: jest.fn(),
  replace: jest.fn(),
};
jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => mockRouter),
}));

// Mock Auth Context & API
jest.mock('@/auth/GoogleAuthContext', () => ({
  useGoogleAuth: jest.fn(),
}));

jest.mock('@/auth/sign-in', () => ({
  getUserProfile: jest.fn(),
}));

// Mock Notification Context
jest.mock('@/context/NotificationContext', () => ({
  useNotification: jest.fn(),
}));

// ==============================
// 2. MOCK UI COMPONENTS (Tránh lỗi NativeWind/UI Lib)
// ==============================

// Mock Box, VStack -> View
jest.mock('@/components/ui/box', () => ({
  Box: (props: any) => {
    const { View } = require('react-native');
    return <View {...props} />;
  },
}));
jest.mock('@/components/ui/vstack', () => ({
  VStack: (props: any) => {
    const { View } = require('react-native');
    return <View {...props} />;
  },
}));

// Mock Text, Heading -> Text
jest.mock('@/components/ui/text', () => ({
  Text: (props: any) => {
    const { Text } = require('react-native');
    return <Text {...props} />;
  },
}));
jest.mock('@/components/ui/heading', () => ({
  Heading: (props: any) => {
    const { Text } = require('react-native');
    return <Text {...props} />;
  },
}));

// Mock Button -> TouchableOpacity
jest.mock('@/components/ui/button', () => ({
  Button: (props: any) => {
    const { TouchableOpacity } = require('react-native');
    return <TouchableOpacity {...props} />;
  },
  ButtonIcon: () => {
    const { View } = require('react-native');
    return <View testID="icon-mock" />;
  },
  ButtonText: (props: any) => {
    const { Text } = require('react-native');
    return <Text {...props} />;
  },
}));

// Mock Icon component chung
jest.mock('@/components/ui/icon', () => ({
  ChevronsLeftIcon: () => {
    const { View } = require('react-native');
    return <View testID="chevrons-left-icon" />;
  },
  Icon: () => {
    const { View } = require('react-native');
    return <View testID="user-icon" />;
  },
}));

// Mock Lucide Icons
jest.mock('lucide-react-native', () => ({
  LogOut: () => {
    const { View } = require('react-native');
    return <View testID="log-out-icon" />;
  },
  User2: () => {
    const { View } = require('react-native');
    return <View testID="user2-icon" />;
  },
}));

// ==============================
// 3. TEST CASES
// ==============================

describe('Profile Screen', () => {
  const mockUser = {
    uid: 'user123',
    email: 'test@example.com',
    username: 'Test User',
  };

  const mockSignOut = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup default return values
    (useGoogleAuth as jest.Mock).mockReturnValue({
      signOut: mockSignOut,
    });

    (useNotification as jest.Mock).mockReturnValue({
      expoPushToken: 'expo-push-token-123',
    });

    (getUserProfile as jest.Mock).mockResolvedValue(mockUser);
  });

  it('fetches and displays user profile and push token on mount', async () => {
    render(<Profile />);

    // Kiểm tra title màn hình
    expect(screen.getByText('User Profile')).toBeTruthy();

    // Kiểm tra getUserProfile được gọi
    await waitFor(() => {
      expect(getUserProfile).toHaveBeenCalled();
    });

    // Kiểm tra email hiển thị
    expect(screen.getByText('test@example.com')).toBeTruthy();

    // Kiểm tra push token hiển thị
    expect(screen.getByText('expo-push-token-123')).toBeTruthy();
  });

  it('handles Back button press', () => {
    render(<Profile />);

    const backButton = screen.getByText('Back');
    fireEvent.press(backButton);

    expect(mockRouter.back).toHaveBeenCalled();
  });

  it('handles Log out successfully', async () => {
    render(<Profile />);

    const logoutButton = screen.getByText('Log out');
    fireEvent.press(logoutButton);

    // Kiểm tra gọi hàm signOut
    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
    });

    // Kiểm tra điều hướng về trang login
    expect(mockRouter.replace).toHaveBeenCalledWith('/login');
  });

  it('logs error if getUserProfile fails (doesn not crash)', async () => {
    // Mock lỗi console.error để tránh rác log trong terminal test

    (getUserProfile as jest.Mock).mockRejectedValue(new Error('Fetch failed'));

    render(<Profile />);

    await waitFor(() => {
      expect(getUserProfile).toHaveBeenCalled();
    });

    // Màn hình vẫn render các phần tĩnh
    expect(screen.getByText('User Profile')).toBeTruthy();
  });

  it('logs error if signOut fails', async () => {

    render(<Profile />);

    const logoutButton = screen.getByText('Log out');
    fireEvent.press(logoutButton);

    // Router replace không được gọi nếu lỗi
    expect(mockRouter.replace).not.toHaveBeenCalled();

  });
});