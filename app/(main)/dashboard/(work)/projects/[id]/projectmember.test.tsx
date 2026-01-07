import { useProjects } from '@/context/ProjectsContext';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import React from 'react';
import ProjectMembers from './members'; // Đảm bảo đường dẫn import đúng

// ==============================
// 1. MOCK CÁC MODULE BÊN NGOÀI
// ==============================

// Fix: Move require inside the component function to avoid hoisting issues

// Mock Box
jest.mock('@/components/ui/box', () => ({
  Box: (props: any) => {
    const { View } = require('react-native');
    return <View {...props} />;
  },
}));

// Mock Text
jest.mock('@/components/ui/text', () => ({
  Text: (props: any) => {
    const { Text } = require('react-native');
    return <Text {...props} />;
  },
}));

// Mock Expo Router
jest.mock('expo-router', () => ({
  router: { back: jest.fn() },
}));

// Mock Projects Context
jest.mock('@/context/ProjectsContext', () => ({
  useProjects: jest.fn(),
}));

// ==============================
// 2. MOCK ICONS
// ==============================
jest.mock('lucide-react-native', () => ({
  ChevronsLeft: () => {
    const { Text } = require('react-native');
    return <Text>IconChevronsLeft</Text>;
  },
  UserPlus: () => {
    const { Text } = require('react-native');
    return <Text>IconUserPlus</Text>;
  },
}));

// ==============================
// 3. MOCK COMPONENT CON
// ==============================

// Mock SearchBar
jest.mock('@/components/search/SearchBar', () => {
  const SearchBar = ({ value, onChange }: any) => {
    const { TextInput } = require('react-native');
    return (
      <TextInput
        testID="search-bar"
        value={value}
        onChangeText={onChange}
        placeholder="Search member"
      />
    );
  };
  return SearchBar;
});

// Mock MemberCard
jest.mock('@/components/card/MemberCard', () => {
  const MemberCard = ({ name, role }: any) => {
    const { View, Text } = require('react-native');
    return (
      <View testID="member-card">
        <Text>{name}</Text>
        <Text>{role}</Text>
      </View>
    );
  };
  return MemberCard;
});

// Mock AddMemberModal
jest.mock('@/components/project/AddMember', () => {
  const AddMemberModal = ({ visible, onClose }: any) => {
    if (!visible) return null;
    const { View, Text, TouchableOpacity } = require('react-native');
    return (
      <View testID="add-member-modal">
        <Text>Add Member Modal Content</Text>
        <TouchableOpacity onPress={onClose} testID="close-modal-btn">
          <Text>Close</Text>
        </TouchableOpacity>
      </View>
    );
  };
  return AddMemberModal;
});

// ==============================
// 4. TEST CASES
// ==============================

describe('ProjectMembers Screen', () => {
  const mockMembers = [
    { uid: '1', email: 'alice@example.com', role: 'admin' },
    { uid: '2', email: 'bob@example.com', role: 'member' },
    { uid: '3', email: 'charlie@example.com', role: 'viewer' },
  ];

  const mockProjectData = {
    // Component gọi: project.project.proj_name
    project: {
      proj_id: 'p1',
      proj_name: 'Awesome Project',
      // members: mockMembers, <--- SAI: Đừng để members ở đây nếu component gọi project.members
    },
    // Component gọi: project.members
    members: mockMembers, 
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useProjects as jest.Mock).mockReturnValue({
      project: mockProjectData,
      updateMembers: jest.fn(),
    });
  });

  it('renders "Project not found" when project is null', () => {
    (useProjects as jest.Mock).mockReturnValue({ project: null, updateMembers: jest.fn() });

    render(<ProjectMembers />);
    expect(screen.getByText('Project not found')).toBeTruthy();
  });

  it('renders project name and members correctly', () => {
    render(<ProjectMembers />);

    expect(screen.getByText('Awesome Project')).toBeTruthy();
    expect(screen.getByText('alice@example.com')).toBeTruthy();
    expect(screen.getByText('bob@example.com')).toBeTruthy();
    expect(screen.getByText('charlie@example.com')).toBeTruthy();
    expect(screen.getByText('admin')).toBeTruthy();
  });

  it('filters members when searching', async () => {
    render(<ProjectMembers />);
    const searchInput = screen.getByTestId('search-bar');

    fireEvent.changeText(searchInput, 'alice');

    await waitFor(() => {
      expect(screen.getAllByTestId('member-card').length).toBe(1);
      expect(screen.getByText('alice@example.com')).toBeTruthy();
      expect(screen.queryByText('bob@example.com')).toBeNull();
    });
  });

  it('restores all members when search is cleared', async () => {
    render(<ProjectMembers />);
    const searchInput = screen.getByTestId('search-bar');

    fireEvent.changeText(searchInput, 'alice');
    fireEvent.changeText(searchInput, '');

    await waitFor(() => {
      expect(screen.getAllByTestId('member-card').length).toBe(3);
    });
  });

  it('opens AddMemberModal when clicking Add member button', async () => {
    render(<ProjectMembers />);
    expect(screen.queryByTestId('add-member-modal')).toBeNull();

    fireEvent.press(screen.getByText('Add member'));

    expect(screen.getByTestId('add-member-modal')).toBeTruthy();
  });

  it('closes AddMemberModal when onClose is triggered', async () => {
    render(<ProjectMembers />);
    fireEvent.press(screen.getByText('Add member'));
    expect(screen.getByTestId('add-member-modal')).toBeTruthy();

    fireEvent.press(screen.getByTestId('close-modal-btn'));
    await waitFor(() => {
      expect(screen.queryByTestId('add-member-modal')).toBeNull();
    });
  });

  it('navigates back when clicking Back button', () => {
    render(<ProjectMembers />);
    fireEvent.press(screen.getByText('Back'));
    expect(router.back).toHaveBeenCalled();
  });
});