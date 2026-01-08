import { useGoogleAuth } from '@/auth/GoogleAuthContext';
import { signIn as signInWithEmail } from '@/auth/sign-in';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import React from 'react';
import Login from './index'; // Đảm bảo đường dẫn import đúng

// ==============================
// 1. MOCK CÁC MODULE BÊN NGOÀI
// ==============================

// Mock Expo Router
const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
};
jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => mockRouter),
}));

// Mock Lottie (Native Module)
jest.mock('lottie-react-native', () => {
  const { View } = require('react-native');
  const LottieView = (props: any) => <View testID="lottie-view" {...props} />;
  return LottieView;
});

// Mock LinearGradient (Native Module)
jest.mock('expo-linear-gradient', () => {
  const React = require('react');
  const { View } = require('react-native');

  const MockLinear = React.forwardRef((props: any, ref: any) => (
    <View ref={ref} {...props}>
      {props.children}
    </View>
  ));

  MockLinear.displayName = 'LinearGradient';

  return { LinearGradient: MockLinear };
});


// Mock Auth Context
jest.mock('@/auth/GoogleAuthContext', () => ({
  useGoogleAuth: jest.fn(),
}));

// Mock Email Sign-In API
jest.mock('@/auth/sign-in', () => ({
  signIn: jest.fn(),
}));

// ==============================
// 2. MOCK UI COMPONENTS (QUAN TRỌNG)
// ==============================
// Vì bạn dùng custom components (@/components/ui/...), ta cần mock chúng
// về các component chuẩn của RN để "fireEvent" hoạt động đúng.

jest.mock('@/components/ui/box', () => ({
  Box: (props: any) => {
    const { View } = require('react-native');
    return <View {...props} />;
  },
}));

jest.mock('@/components/ui/hstack', () => ({
  HStack: (props: any) => {
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

// Mock Input System
jest.mock('@/components/ui/input', () => {
  const { View, TouchableOpacity, TextInput } = require('react-native');
  const Input = (props: any) => <View {...props} />;
  const InputField = (props: any) => (
    <TextInput
      testID={props.placeholder === 'Password' ? 'password-input' : 'email-input'}
      {...props}
    />
  );
  const InputSlot = (props: any) => <TouchableOpacity testID="input-slot" {...props} />;
  const InputIcon = () => <View />;
  return {
    Input,
    InputField,
    InputSlot,
    InputIcon,
  };
});

// Mock Icons
jest.mock('@/components/ui/icon', () => ({
  EyeIcon: () => null,
  EyeOffIcon: () => null,
}));

// ==============================
// 3. TEST CASES
// ==============================

describe('Login Screen', () => {
  const mockSignInGoogle = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Default Mock: User chưa login, không loading
    (useGoogleAuth as jest.Mock).mockReturnValue({
      user: null,
      isLoading: false,
      signIn: mockSignInGoogle,
    });
  });

  // --- RENDERING ---
  it('renders login form correctly', () => {
    render(<Login />);

    expect(screen.getByText('CloneJira')).toBeTruthy();
    expect(screen.getByText('Sign in')).toBeTruthy();
    expect(screen.getByPlaceholderText('Email')).toBeTruthy();
    expect(screen.getByPlaceholderText('Password')).toBeTruthy();
    expect(screen.getByText('Login')).toBeTruthy();
    expect(screen.getByText('Login with Google')).toBeTruthy();
  });

  // --- LOADING STATE ---
  it('shows loading indicator when isLoading is true', () => {
    (useGoogleAuth as jest.Mock).mockReturnValue({
      user: null,
      isLoading: true, // Mock loading
      signIn: mockSignInGoogle,
    });

    render(<Login />);
    expect(screen.getByTestId('activity-indicator')).toBeTruthy(); // Cần đảm bảo ActivityIndicator render (RN mặc định có thể tìm bằng type, nhưng ở đây check sự tồn tại là được)
    // Note: Nếu RNTL không tìm thấy ActivityIndicator bằng text, ta có thể check queryByText('Sign in') toBeNull
    expect(screen.queryByText('Sign in')).toBeNull();
  });

  // --- AUTO REDIRECT ---
  it('redirects to dashboard if user is already logged in', () => {
    (useGoogleAuth as jest.Mock).mockReturnValue({
      user: { name: 'Test User' },
      isLoading: false,
      signIn: mockSignInGoogle,
    });

    render(<Login />);

    expect(mockRouter.replace).toHaveBeenCalledWith('/dashboard');
  });

  // --- SIGN UP NAVIGATION ---
  it('navigates to signup page when clicking Sign Up', () => {
    render(<Login />);

    const signUpBtn = screen.getByText('Sign Up');
    fireEvent.press(signUpBtn);

    expect(mockRouter.push).toHaveBeenCalledWith('/signup');
  });

  // --- EMAIL LOGIN FLOW ---
  it('handles email login success', async () => {
    // Setup Mock API thành công
    (signInWithEmail as jest.Mock).mockResolvedValue('success');

    render(<Login />);

    // Nhập Email
    const emailInput = screen.getByTestId('email-input');
    fireEvent.changeText(emailInput, 'test@example.com');

    // Nhập Password
    const passwordInput = screen.getByTestId('password-input');
    fireEvent.changeText(passwordInput, 'password123');

    // Bấm nút Login
    const loginBtn = screen.getByText('Login');
    fireEvent.press(loginBtn);

    // Kiểm tra logic
    await waitFor(() => {
      expect(signInWithEmail).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(mockRouter.replace).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('handles email login failure (does not redirect)', async () => {
    // Setup Mock API thất bại

    render(<Login />);

    const loginBtn = screen.getByText('Login');
    fireEvent.press(loginBtn);

    await waitFor(() => {
      expect(signInWithEmail).toHaveBeenCalled();
      // Không được chuyển trang
      expect(mockRouter.replace).not.toHaveBeenCalled();
    });

  });

  // --- GOOGLE LOGIN FLOW ---
  it('handles Google login', async () => {
    render(<Login />);

    const googleBtn = screen.getByText('Login with Google');
    fireEvent.press(googleBtn);

    await waitFor(() => {
      expect(mockSignInGoogle).toHaveBeenCalled();
    });
  });

  // --- PASSWORD VISIBILITY ---
  it('toggles password visibility', () => {
    render(<Login />);

    const passwordInput = screen.getByTestId('password-input');

    // Mặc định là password (secureTextEntry = true trong logic của component, 
    // nhưng trong test ta check prop type hoặc secureTextEntry tùy vào cách mock InputField)

    // Ở component của bạn: type={showPassword ? 'text' : 'password'}
    // Ta kiểm tra prop 'type' hoặc 'secureTextEntry' trên mock
    expect(passwordInput.props.type).toBe('password');

    // Bấm vào icon mắt (InputSlot)
    const toggleBtn = screen.getByTestId('input-slot');
    fireEvent.press(toggleBtn);

    // Sau khi bấm, type đổi thành text
    expect(passwordInput.props.type).toBe('text');
  });
});