import { getUserNotifications } from '@/api/users';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import React from 'react';
import Notification from '../(main)/notification';

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

// Mock API
jest.mock('@/api/users', () => ({
  getUserNotifications: jest.fn(),
}));

// Mock UI Components (Tránh lỗi NativeWind/Styles)
// Thay thế các component custom bằng View/Text chuẩn của RN
jest.mock('@/components/ui/box', () => ({
  Box: (props: any) => {
    const { View } = require('react-native');
    return <View {...props} />;
  },
}));

jest.mock('@/components/ui/button', () => ({
  Button: (props: any) => {
    const { TouchableOpacity } = require('react-native');
    return <TouchableOpacity {...props} />;
  },
  ButtonIcon: () => {
    const { View } = require('react-native');
    return <View testID="icon-back" />; // Mock icon thành View để dễ check
  },
  ButtonText: (props: any) => {
    const { Text } = require('react-native');
    return <Text {...props} />;
  },
}));

jest.mock('@/components/ui/text', () => ({
  Text: (props: any) => {
    const { Text } = require('react-native');
    return <Text {...props} />;
  },
}));

jest.mock('@/components/ui/icon', () => ({
  ChevronsLeftIcon: () => {
    const { Text } = require('react-native');
    return <Text>IconChevronsLeft</Text>;
  },
}));

// Mock Lucide Icons
jest.mock('lucide-react-native', () => ({
  Inbox: () => {
    const { Text } = require('react-native');
    return <Text>IconInbox</Text>;
  },
}));

// Mock NotiCard (Component con)
// Chỉ cần render ra title/content để verify dữ liệu đã truyền xuống đúng
jest.mock('@/components/card/NotiCard', () => {
  const NotiCard = ({ title, description, time }: any) => {
    const { View, Text } = require('react-native');
    return (
      <View testID="noti-card">
        <Text>{title}</Text>
        <Text>{description}</Text>
        <Text>{time}</Text>
      </View>
    );
  };
  
  return NotiCard;
});

// ==============================
// 2. TEST CASES
// ==============================

describe('Notification Screen', () => {
  // Data giả
  const mockNotifications = [
    {
      noti_id: '1',
      title: 'New Task Assigned',
      content: 'You have a new task in Project X',
      notifyType: 'info',
      notifyAt: '10:00 AM',
    },
    {
      noti_id: '2',
      title: 'Deadline Approaching',
      content: 'Task Y is due tomorrow',
      notifyType: 'warning',
      notifyAt: '11:00 AM',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- CASE 1: LOAD DỮ LIỆU THÀNH CÔNG ---
  it('fetches and renders notifications correctly', async () => {
    // Setup API trả về mảng dữ liệu
    (getUserNotifications as jest.Mock).mockResolvedValue(mockNotifications);

    render(<Notification />);

    // Kiểm tra API được gọi
    await waitFor(() => {
        expect(getUserNotifications).toHaveBeenCalled();
    });

    // Kiểm tra tiêu đề màn hình
    expect(screen.getByText('Notifications')).toBeTruthy();

    // Kiểm tra dữ liệu được render ra màn hình (thông qua Mock NotiCard)
    expect(screen.getByText('New Task Assigned')).toBeTruthy();
    expect(screen.getByText('You have a new task in Project X')).toBeTruthy();
    expect(screen.getByText('Deadline Approaching')).toBeTruthy();
    
    // Đảm bảo không hiện thị Empty State
    expect(screen.queryByText('Empty notification')).toBeNull();
  });

  // --- CASE 2: EMPTY STATE (KHÔNG CÓ THÔNG BÁO) ---
  it('renders empty state when there are no notifications', async () => {
    // Setup API trả về mảng rỗng
    (getUserNotifications as jest.Mock).mockResolvedValue([]);

    render(<Notification />);

    // Chờ API gọi xong và render lại
    await waitFor(() => expect(getUserNotifications).toHaveBeenCalled());

    // Kiểm tra hiển thị text Empty
    expect(screen.getByText('Empty notification')).toBeTruthy();
    
    // Kiểm tra hiển thị Icon Inbox (đã mock thành text 'IconInbox')
    expect(screen.getByText('IconInbox')).toBeTruthy();

    // Đảm bảo không render NotiCard nào
    expect(screen.queryByTestId('noti-card')).toBeNull();
  });

  // --- CASE 3: NÚT BACK (NAVIGATION) ---
  it('navigates back when clicking the back button', async () => {
    (getUserNotifications as jest.Mock).mockResolvedValue([]); // Trả về rỗng cho gọn
    render(<Notification />);

    // Tìm nút Back (Trong code là <ButtonText>Back</ButtonText>)
    const backButton = screen.getByText('Back');

    // Giả lập bấm nút
    fireEvent.press(backButton);

    // Kiểm tra router.back() được gọi
    expect(mockBack).toHaveBeenCalled();
  });
});