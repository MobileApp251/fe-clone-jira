import { render, screen, waitFor } from '@testing-library/react-native';
import React from 'react';
import TaskDetail from './index';

import { getTaskById } from '@/api/tasks';
import { useToast } from '@/components/ui/toast';
import { useProjects } from '@/context/ProjectsContext';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { TaskPriority } from '@/utils/taskStatus';
import { ProjectMembers, TaskAPIResponse, TaskData } from '@/utils/workType';

/* =======================
   MOCK ROUTER
======================= */
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  useLocalSearchParams: jest.fn(),
}));

/* =======================
   MOCK API
======================= */
jest.mock('@/api/tasks');

/* =======================
   MOCK CONTEXT
======================= */
jest.mock('@/context/ProjectsContext');

/* =======================
   MOCK TOAST
======================= */
jest.mock('@/components/ui/toast', () => ({
  useToast: jest.fn(),
  Toast: ({ children }: any) => children,
  ToastTitle: ({ children }: any) => children,
  ToastDescription: ({ children }: any) => children,
}));

/* =======================
   MOCK UI COMPONENTS
======================= */
jest.mock('@/components/popup/DeleteTask', () => 'DeleteTask');
jest.mock('@/components/popup/EditTask', () => 'EditTask');
jest.mock('@/components/popup/EditAssignee', () => 'EditAssignee');
jest.mock('@/components/popup/StatusMenu', () => 'StatusMenu');
jest.mock('@/components/popup/TaskPriorityMenu', () => 'TaskPriorityMenu');
jest.mock('@/components/card/AssigneeCard', () => 'AssigneeCard');
jest.mock('@/components/datepicker/DatePickerField', () => 'DatePickerField');

jest.mock('@/components/ui/box', () => ({
  Box: ({ children }: any) => children,
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onPress }: any) => (
    <button onClick={onPress}>{children}</button>
  ),
  ButtonIcon: () => null,
  ButtonText: ({ children }: any) => children,
}));

jest.mock('@/components/ui/icon', () => ({
  ChevronsLeftIcon: () => null,
  EditIcon: () => null,
  TrashIcon: () => null,
}));

jest.mock('@/components/ui/textarea', () => ({
  Textarea: ({ children }: any) => <>{children}</>,
  TextareaInput: ({ value }: any) => <input value={value} />,
}));

jest.mock('@/components/ui/vstack', () => ({
  VStack: ({ children }: any) => children,
}));

jest.mock('dayjs', () => ({
  __esModule: true,
  default: () => ({
    toISOString: () => '2024-01-01T00:00:00.000Z',
  }),
}));

/* =======================
   TYPE CAST
======================= */
const mockGetTaskById = getTaskById as jest.MockedFunction<typeof getTaskById>;
const mockUseProjects = useProjects as jest.MockedFunction<typeof useProjects>;
const mockUseToast = useToast as jest.MockedFunction<typeof useToast>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseLocalSearchParams = useLocalSearchParams as jest.MockedFunction<
  typeof useLocalSearchParams
>;

/* =======================
   MOCK DATA
======================= */
const mockTask: TaskData = {
  task_id: '1',
  task_name: 'Test Task',
  content: 'Test description',
  status: 'progress',
  priority: 'high' as TaskPriority,
  startAt: '2024-01-01T00:00:00.000Z',
  endAt: '2024-12-31T00:00:00.000Z',
  createAt: new Date(),
  updateAt: new Date(),
  proj_id: 'project1',
};

const mockMembers: ProjectMembers[] = [
  { uid: 'u1', email: 'a@test.com', role: 'dev', username: 'a' },
];

const mockTaskResponse: TaskAPIResponse = {
  task: mockTask,
  members: mockMembers,
};

describe('TaskDetail', () => {
  const mockRouter = { back: jest.fn() };
  const mockToast = { show: jest.fn(), isActive: jest.fn(() => false) };

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseRouter.mockReturnValue(mockRouter as any);
    mockUseToast.mockReturnValue(mockToast as any);

    mockUseLocalSearchParams.mockReturnValue({
      id: '1',
      projectId: 'project1',
    });

    mockUseProjects.mockReturnValue({
      projectTasks: [],
      project: { members: mockMembers },
      updateProjectTask: jest.fn(),
    } as any);
  });

  /* =======================
     LOADING
  ======================= */
  it('should show loading indicator initially', async () => {
    const { queryByTestId } = render(<TaskDetail />);

    // lúc đầu có loading
    expect(queryByTestId('loading-indicator')).toBeTruthy();

    // sau khi load xong thì mất
    await waitFor(() => {
      expect(queryByTestId('loading-indicator')).toBeNull();
    });
  });


  /* =======================
     RENDER DATA
  ======================= */
  it('should render task title and description', async () => {
    mockGetTaskById.mockResolvedValue(mockTaskResponse);

    render(<TaskDetail />);

    await waitFor(() => {
      expect(screen.getByText('Test Task')).toBeTruthy();
      expect(screen.queryAllByText('Test description')).toBeTruthy();
    });
  });

  /* =======================
     ERROR FETCH
  ======================= */
  it('should handle fetch error gracefully', async () => {
    mockGetTaskById.mockRejectedValue(new Error('Fetch failed'));

    render(<TaskDetail />);

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).toBeNull();
    });
  });

  /* =======================
     EDGE CASES
  ======================= */
  it('should handle empty description', async () => {
    mockGetTaskById.mockResolvedValue({
      ...mockTaskResponse,
      task: { ...mockTask, content: '' },
    });

    render(<TaskDetail />);

    await waitFor(() => {
      expect(screen.getByText('Description')).toBeTruthy();
    });
  });

  it('should handle empty assignee list', async () => {
    mockGetTaskById.mockResolvedValue({
      ...mockTaskResponse,
      members: [],
    });

    render(<TaskDetail />);

    await waitFor(() => {
      expect(screen.getByText('Assignee')).toBeTruthy();
    });
  });

  /* =======================
     PARAMS
  ======================= */
  it('should call API with correct params', async () => {
    mockGetTaskById.mockResolvedValue(mockTaskResponse);

    render(<TaskDetail />);

    await waitFor(() => {
      expect(mockGetTaskById).toHaveBeenCalledWith('project1', '1');
    });
  });
});
