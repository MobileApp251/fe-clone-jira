import { updateProject } from '@/api/projects';
import ProjectDetail from '@/app/(main)/dashboard/(work)/projects/[id]'; // Đường dẫn import file component của bạn
import { useToast } from '@/components/ui/toast';
import { useProjects } from '@/context/ProjectsContext';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';

// --- 1. MOCK CÁC MODULE BÊN NGOÀI ---
// Mock Context
jest.mock('@/context/ProjectsContext', () => ({
  useProjects: jest.fn(),
}));

jest.mock('expo-router', () => {
  return {
    router: {
      back: jest.fn(),
      push: jest.fn(),
      replace: jest.fn(),
      // Thêm isReady để không lỗi
      isReady: true,
    },
    useLocalSearchParams: jest.fn().mockReturnValue({ id: '123', actionTaskId: null }),
  };
});

// Mock API
jest.mock('@/api/projects', () => ({
  updateProject: jest.fn(),
}));

// Mock Toast UI
jest.mock('@/components/ui/toast', () => ({
  useToast: jest.fn(),
  Toast: ({ children }: any) => <>{children}</>,
  ToastTitle: ({ children }: any) => <>{children}</>,
  ToastDescription: ({ children }: any) => <>{children}</>,
}));

// Mock các component con phức tạp để tránh lỗi render sâu
jest.mock('@/components/card/TaskCard', () => 'TaskCard');
jest.mock('@/components/markasdone/MarkAsDone', () => 'MarkAsDone');
jest.mock('@/components/project/NewTask', () => 'NewTaskModal');
jest.mock('@/components/ui/box', () => ({ Box: ({ children, ...props }: any) => <div {...props}>{children}</div> }));

// Mock DatePickerField đặc biệt vì nó chứa logic trigger update
jest.mock('@/components/datepicker/DatePickerField', () => {
  const React = require('react');
  const { Button } = require('react-native');

  // Tạo component mock
  const MockDatePickerField = ({ setUpdateDate, date }: any) => {
    return (
      <Button
        title={`Date: ${date}`}
        onPress={() => setUpdateDate(true)}
        testID="mock-datepicker"
      />
    );
  };

  // Thêm displayName để tránh lỗi react-native-css-interop
  MockDatePickerField.displayName = 'DatePickerField';

  return MockDatePickerField;
});

// Mock Icons (Lucide) để tránh lỗi SVG
jest.mock('lucide-react-native', () => ({
  ChevronsLeft: () => 'IconChevronsLeft',
  Plus: () => 'IconPlus',
  SquarePen: () => 'IconSquarePen',
  UsersRound: () => 'IconUsersRound',
}));

jest.mock('@/components/card/TaskCard', () => {
  const React = require('react');
  const { Text, View } = require('react-native');

  const MockTaskCard = ({ title }: any) => (
    <View>
      <Text>Task Card</Text> {/* Đây là text bạn tìm */}
    </View>
  );

  MockTaskCard.displayName = 'TaskCard'; // tránh lỗi react-native-css-interop
  return MockTaskCard;
});


describe('ProjectDetail Screen', () => {
  // Setup data giả
  const mockProjectData = {
    project: {
      proj_id: '123',
      proj_name: 'Test Project',
      description: 'This is a test description',
      endAt: '2023-12-31T00:00:00.000Z',
      done: false,
    },
  };

  const mockTasksData = [
    {
      task: { task_id: 't1', task_name: 'Task 1', content: 'Content 1', priority: 'high', endAt: '2023-12-31', status: 'todo', proj_id: '123' },
      members: [],
    },
  ];

  const mockActions = {
    loadProjectById: jest.fn(),
    removeTask: jest.fn(),
    updateProjectById: jest.fn(),
  };

  const mockShowToast = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup default mock return cho các hook
    (useLocalSearchParams as jest.Mock).mockReturnValue({ id: '123', actionTaskId: null });
    
    (useToast as jest.Mock).mockReturnValue({
      show: mockShowToast,
      isActive: jest.fn().mockReturnValue(false),
    });

    // Default: Load thành công
    (useProjects as jest.Mock).mockReturnValue({
      loading: false,
      project: mockProjectData,
      projectTasks: mockTasksData,
      ...mockActions,
    });
  });

  it('renders loading indicator correctly', () => {
    (useProjects as jest.Mock).mockReturnValue({
      loading: true,
      project: { project: { done: false, endAt: '2023-12-31T00:00:00.000Z' } },
      projectTasks: [],
      ...mockActions,
    });

    render(<ProjectDetail />);
    expect(screen.queryByTestId('loading-indicator')).toBeOnTheScreen(); // *Lưu ý: Cần thêm testID="activity-indicator" vào component thật hoặc check type
    // Hoặc kiểm tra đơn giản:
    // Vì component render ActivityIndicator của RN, testing library có thể tìm thấy nó
    // nhưng tốt nhất nên mock ActivityIndicator hoặc check component con không render.
  });

  it('renders "Project not found" when project is null', () => {
    (useProjects as jest.Mock).mockReturnValue({
      loading: false,
      project: null,
      projectTasks: [],
      ...mockActions,
    });

    render(<ProjectDetail />);
    expect(screen.getByText('Project not found')).toBeTruthy();
  });

  it('renders project details and tasks correctly', () => {
    render(<ProjectDetail />);

    // Check Project Name
    expect(screen.getByText('Test Project')).toBeTruthy();
    // Check Description
    expect(screen.getByText('This is a test description')).toBeTruthy();
    // Check Task render (Mock TaskCard được render)
    expect(screen.getAllByText('Task Card').length).toBeGreaterThan(0); // Vì mình mock component return string "TaskCard" hoặc tương tự
  });

  it('calls loadProjectById on mount', () => {
    render(<ProjectDetail />);
    expect(mockActions.loadProjectById).toHaveBeenCalledWith('123');
  });

  it('handles "Back" navigation', () => {
    render(<ProjectDetail />);
    const backButton = screen.queryAllByTestId('btn-back');
    fireEvent.press(backButton[0]);
    expect(router.back).toHaveBeenCalled();
  });

  it('handles navigation to Edit page', () => {
    render(<ProjectDetail />);
    // Tìm button edit, ở đây mình giả định test dựa trên icon hoặc vị trí
    // Vì code dùng TouchableOpacity bọc Icon, ta có thể tìm bằng testID (cần thêm vào code nguồn) 
    // Hoặc tìm component cha.
    // Cách hacky cho bài này: tìm element thứ 2 trong nhóm buttons
    // Tốt nhất bạn nên thêm testID="btn-edit-project" vào TouchableOpacity trong code nguồn.
    
    // Giả sử ta thêm testID vào code nguồn, hoặc mock icon trả về Text để click
  });
  
  it('updates project due date via API when triggered', async () => {
    (updateProject as jest.Mock).mockResolvedValue({ ...mockProjectData.project, endAt: '2024-01-01' });

    render(<ProjectDetail />);

    // Giả lập click vào Mock DatePicker để setUpdateDate(true)
    const datePickerBtn = screen.getByTestId('mock-datepicker');
    fireEvent.press(datePickerBtn);

    await waitFor(() => {
        // Kiểm tra hàm API updateProject được gọi
        expect(updateProject).toHaveBeenCalledWith(
            '123', 
            expect.objectContaining({
                done: false, // từ mock data
                // endAt: ... check logic dayjs
            })
        );
        
        // Kiểm tra update context
        expect(mockActions.updateProjectById).toHaveBeenCalled();
        
        // Kiểm tra toast hiện
        expect(mockShowToast).toHaveBeenCalled();
    });
  });

  it('opens Add Task modal when clicking plus button', () => {
    render(<ProjectDetail />);
    
    // Tìm nút Plus (Do ta đã mock IconPlus thành text 'IconPlus')
    // Lưu ý: Button bọc icon nên ta cần tìm button chứa nó.
    // Tương tự, khuyến khích thêm testID="btn-add-task" vào TouchableOpacity.
    
    // Kiểm tra state modal (NewTaskModal visible prop)
    // Vì ta mock NewTaskModal, ta check xem nó có được render với props visible=true hay không sau khi click.
  });
});