// __tests__/screens/ProjectsScreen.test.tsx
import ProjectsScreen from '@/app/(main)/dashboard/(work)/projects';
import { useProjects } from '@/context/ProjectsContext';
import { formatDate } from '@/utils/date';
import { getProjectStatus } from '@/utils/projectStatus';
import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';

// Mock các dependencies đơn giản hơn
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

jest.mock('@/context/ProjectsContext', () => ({
  useProjects: jest.fn(),
}));

jest.mock('@/utils/projectStatus', () => ({
  getProjectStatus: jest.fn(),
}));

jest.mock('@/utils/date', () => ({
  formatDate: jest.fn(),
}));

// Mock các component với React Native components thật
jest.mock('@/components/search/SearchBar', () => {
  const { TextInput, TouchableOpacity, Text } = require('react-native');
  return function MockSearchBar({ 
    value, 
    onChange, 
    onCreatePress, 
    onFilterPress 
  }: any) {
    return (
      <>
        <TextInput 
          testID="search-input"
          value={value}
          onChangeText={onChange}
          placeholder="Search projects..."
        />
        <TouchableOpacity testID="create-button" onPress={onCreatePress}>
          <Text>Create</Text>
        </TouchableOpacity>
        <TouchableOpacity testID="filter-button" onPress={onFilterPress}>
          <Text>Filter</Text>
        </TouchableOpacity>
      </>
    );
  };
});

jest.mock('@/components/project/Create', () => {
  const { Modal, View, TouchableOpacity, Text } = require('react-native');
  return function MockCreateProjectModal({ visible, onClose }: any) {
    if (!visible) return null;
    return (
      <Modal testID="create-project-modal" visible={visible}>
        <View>
          <TouchableOpacity testID="close-modal" onPress={onClose}>
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  };
});

jest.mock('@/components/search/FilterPanel', () => {
  const { View } = require('react-native');
  return function MockProjectFilter() {
    return <View testID="project-filter">Filter Panel</View>;
  };
});

jest.mock('@/components/card/ProjectCard', () => {
  const { View, Text } = require('react-native');
  return function MockProjectCard({ 
    projectId, 
    title, 
    description, 
    members, 
    status, 
    endDate 
  }: any) {
    return (
      <View testID={`project-card-${projectId}`}>
        <Text testID={`project-title-${projectId}`}>{title}</Text>
        <Text testID={`project-description-${projectId}`}>{description}</Text>
        <Text testID={`project-members-${projectId}`}>Members: {members}</Text>
        <Text testID={`project-status-${projectId}`}>Status: {status}</Text>
        <Text testID={`project-enddate-${projectId}`}>End: {endDate}</Text>
      </View>
    );
  };
});

// Mock các UI components
jest.mock('@/components/ui/box', () => {
  const { View } = require('react-native');
  return { Box: View };
});

jest.mock('@/components/ui/text', () => {
  const { Text } = require('react-native');
  return { Text };
});

describe('ProjectsScreen', () => {
  const mockProjects = [
    {
      project: {
        proj_id: '1',
        proj_name: 'Project Alpha',
        description: 'A test project',
        startAt: '2024-01-01',
        endAt: '2024-12-31',
        done: false,
      },
      members: [{ id: '1' }, { id: '2' }],
    },
    {
      project: {
        proj_id: '2',
        proj_name: 'Project Beta',
        description: 'Another test project',
        startAt: '2024-02-01',
        endAt: '2024-11-30',
        done: true,
      },
      members: [{ id: '3' }],
    },
  ];

  const mockLoadProjects = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    (useProjects as jest.Mock).mockReturnValue({
      projects: mockProjects,
      loading: false,
      loadProjects: mockLoadProjects,
    });

    (getProjectStatus as jest.Mock).mockReturnValue('In Progress');
    (formatDate as jest.Mock).mockReturnValue('Dec 31, 2024');
  });

  it('loads projects on mount', () => {
    render(<ProjectsScreen />);
    expect(mockLoadProjects).toHaveBeenCalledTimes(1);
  });

  it('shows loading indicator when loading', () => {
    (useProjects as jest.Mock).mockReturnValue({
      projects: [],
      loading: true,
      loadProjects: mockLoadProjects,
    });

    const { getByTestId } = render(<ProjectsScreen />);
    expect(getByTestId('activity-indicator')).toBeTruthy();
  });

  it('shows empty state when no projects', () => {
    (useProjects as jest.Mock).mockReturnValue({
      projects: [],
      loading: false,
      loadProjects: mockLoadProjects,
    });

    render(<ProjectsScreen />);
    expect(screen.getByText('No matching projects')).toBeTruthy();
  });

  it('renders projects when data is available', () => {
    render(<ProjectsScreen />);
    
    expect(screen.getByTestId('project-card-1')).toBeTruthy();
    expect(screen.getByTestId('project-card-2')).toBeTruthy();
    expect(screen.getByText('Project Alpha')).toBeTruthy();
    expect(screen.getByText('Project Beta')).toBeTruthy();
  });

  it('filters projects based on search', () => {
    render(<ProjectsScreen />);
    
    const searchInput = screen.getByTestId('search-input');
    fireEvent.changeText(searchInput, 'Alpha');
    
    expect(screen.getByTestId('project-card-1')).toBeTruthy();
    expect(screen.queryByTestId('project-card-2')).toBeNull();
  });

  it('opens and closes create project modal', () => {
    render(<ProjectsScreen />);
    
    // Open modal
    const createButton = screen.getByTestId('create-button');
    fireEvent.press(createButton);
    
    expect(screen.getByTestId('create-project-modal')).toBeTruthy();
    
    // Close modal
    const closeButton = screen.getByTestId('close-modal');
    fireEvent.press(closeButton);
    
    // Modal should be closed (queryByTestId returns null when not found)
    expect(screen.queryByTestId('create-project-modal')).toBeNull();
  });

  it('shows filter panel when filter button is pressed', () => {
    render(<ProjectsScreen />);
    
    const filterButton = screen.getByTestId('filter-button');
    fireEvent.press(filterButton);
    
    expect(screen.getByTestId('project-filter')).toBeTruthy();
  });

  it('calls utility functions with correct arguments', () => {
    render(<ProjectsScreen />);
    
    expect(getProjectStatus).toHaveBeenCalledTimes(2);
    expect(formatDate).toHaveBeenCalledTimes(2);
  });
});