import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import ComingSoon from './index';

// ==============================
// 1. MOCK CÁC MODULE BÊN NGOÀI
// ==============================

// Mock Expo Router
const mockBack = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({
    back: mockBack,
  })),
}));

// Mock Lottie React Native
// Native modules không chạy trong Jest, ta thay thế bằng View đơn giản
jest.mock('lottie-react-native', () => {
  const { View } = require('react-native');
  const mockLottie = (props: any) => <View testID="mock-lottie" {...props} />;
  return mockLottie;
});


// Mock UI Button
// Thay thế Button custom bằng TouchableOpacity chuẩn để dễ test sự kiện onPress
jest.mock('@/components/ui/button', () => {
  const { TouchableOpacity } = require('react-native');
  const Button = ({ onPress, children }: any) => (
      <TouchableOpacity onPress={onPress} testID="btn-back">
        {children}
      </TouchableOpacity>
    );
  return { Button };
});

// Mock Icons
jest.mock('lucide-react-native', () => {
  const { View } = require('react-native');
  return {
    ChevronLeft: () => <View testID="icon-chevron-left" />,
  };
});

// ==============================
// 2. TEST CASES
// ==============================

describe('ComingSoon Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test hiển thị nội dung
  it('renders texts and animation placeholder correctly', () => {
    render(<ComingSoon />);

    // Kiểm tra tiêu đề chính
    expect(screen.getByText('Coming Soon')).toBeTruthy();

    // Kiểm tra dòng mô tả (dùng regex hoặc string một phần)
    expect(screen.getByText(/Chức năng đang được phát triển/i)).toBeTruthy();

    // Kiểm tra chữ trên nút
    expect(screen.getByText('Back')).toBeTruthy();

    // Kiểm tra Lottie đã được render (thông qua mock testID)
    expect(screen.getByTestId('mock-lottie')).toBeTruthy();
  });

  // Test chức năng nút Back
  it('navigates back when the back button is pressed', () => {
    render(<ComingSoon />);

    // Tìm nút Back (thông qua testID đã gán ở mock)
    const backButton = screen.getByTestId('btn-back');

    // Giả lập bấm nút
    fireEvent.press(backButton);

    // Kiểm tra hàm router.back() đã được gọi
    expect(mockBack).toHaveBeenCalledTimes(1);
  });
});