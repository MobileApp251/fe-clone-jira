import { useTasks } from '@/context/TasksContext';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { ActivityIndicator } from 'react-native';
import TasksScreen from './index';

/* ======================================================
   MOCK CONTEXT
====================================================== */
jest.mock('@/context/TasksContext');

/* ======================================================
   MOCK SEARCH BAR
====================================================== */
jest.mock('@/components/search/SearchBar', () => {
  const React = require('react');
  const { TextInput } = require('react-native');

  const MockSearchBar = ({ value, onChange }: any) => (
    <TextInput
      testID="search-bar"
      value={value}
      onChangeText={onChange}
    />
  );

  MockSearchBar.displayName = 'MockSearchBar';
  return MockSearchBar;
});

/* ======================================================
   MOCK SORT PANEL
====================================================== */
jest.mock('@/components/search/SortPannel', () => {
  const React = require('react');
  const { View } = require('react-native');

  const MockSortPanel = ({ visible }: any) =>
    visible ? <View testID="sort-panel" /> : null;

  MockSortPanel.displayName = 'MockSortPanel';
  return MockSortPanel;
});

/* ======================================================
   MOCK TASK CARD
====================================================== */
jest.mock('@/components/card/TaskCard', () => {
  const React = require('react');
  const { View, Text } = require('react-native');

  const MockTaskCard = ({ title }: any) => (
    <View testID="task-card">
      <Text>{title}</Text>
    </View>
  );

  MockTaskCard.displayName = 'MockTaskCard';
  return MockTaskCard;
});

/* ======================================================
   MOCK UI WRAPPERS
====================================================== */
jest.mock('@/components/ui/box', () => {
  const React = require('react');
  const { View } = require('react-native');

  const Box = ({ children }: any) => <View>{children}</View>;
  Box.displayName = 'Box';

  return { Box };
});

jest.mock('@/components/ui/text', () => {
  const React = require('react');
  const { Text } = require('react-native');

  const MockText = ({ children }: any) => <Text>{children}</Text>;
  MockText.displayName = 'Text';

  return { Text: MockText };
});

/* ======================================================
   MOCK DATA
====================================================== */
const mockTasks = [
  {
    task_id: '1',
    proj_id: 'p1',
    task_name: 'Write tests',
    content: 'Using Jest',
    status: 'todo',
    endAt: new Date().toISOString(),
    priority: 'high',
  },
  {
    task_id: '2',
    proj_id: 'p1',
    task_name: 'Fix bug',
    content: 'Expo router',
    status: 'done',
    endAt: new Date().toISOString(),
    priority: 'low',
  },
];

describe('<TasksScreen />', () => {
  const loadTasks = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  /* ======================================================
     TEST: loadTasks called
  ====================================================== */
  it('calls loadTasks on mount', () => {
    (useTasks as jest.Mock).mockReturnValue({
      tasks: [],
      loading: false,
      loadTasks,
    });

    render(<TasksScreen />);

    expect(loadTasks).toHaveBeenCalledTimes(1);
  });

  /* ======================================================
     TEST: loading state
  ====================================================== */
  it('shows loading indicator when loading is true', () => {
    (useTasks as jest.Mock).mockReturnValue({
      tasks: [],
      loading: true,
      loadTasks,
    });

    const { UNSAFE_getByType } = render(<TasksScreen />);

    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });

  /* ======================================================
     TEST: empty state
  ====================================================== */
  it('shows empty state when no tasks match', () => {
    (useTasks as jest.Mock).mockReturnValue({
      tasks: [],
      loading: false,
      loadTasks,
    });

    const { getByText } = render(<TasksScreen />);

    expect(getByText('No matching tasks')).toBeTruthy();
  });

  /* ======================================================
     TEST: render list
  ====================================================== */
  it('renders task list when tasks exist', () => {
    (useTasks as jest.Mock).mockReturnValue({
      tasks: mockTasks,
      loading: false,
      loadTasks,
    });

    const { getAllByTestId } = render(<TasksScreen />);

    expect(getAllByTestId('task-card')).toHaveLength(2);
  });

  /* ======================================================
     TEST: search filter
  ====================================================== */
  it('filters tasks by search keyword', () => {
    (useTasks as jest.Mock).mockReturnValue({
      tasks: mockTasks,
      loading: false,
      loadTasks,
    });

    const { getByTestId, queryByText } = render(<TasksScreen />);

    fireEvent.changeText(getByTestId('search-bar'), 'write');

    expect(queryByText('Write tests')).toBeTruthy();
    expect(queryByText('Fix bug')).toBeNull();
  });
});
