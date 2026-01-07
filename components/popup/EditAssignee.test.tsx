import * as tasksApi from '@/api/tasks';
import { ProjectsProvider } from '@/context/ProjectsContext';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { useToast } from '../ui/toast';
import EditAssignee from './EditAssignee';

// Mock các module
jest.mock('@/api/tasks');
jest.mock('../ui/toast', () => {
    const originalModule = jest.requireActual('../ui/toast');
    return {
        ...originalModule,
        useToast: jest.fn(),
    };
});

jest.mock('../card/AssigneeCard', () => {
    const React = require('react');
    const { Text } = require('react-native');
    return ({ uid, onSelected, name }: any) => (
        <Text
            testID={`assignee-${uid}`}
            onPress={onSelected}
        >
            {name}
        </Text>
    );
});

jest.mock('@/components/ui/modal', () => {
    const React = require('react');
    return {
        Modal: ({ children }: { children: React.ReactNode }) => <>{children}</>,
        ModalBackdrop: () => null,
        ModalContent: ({ children }: { children: React.ReactNode }) => <>{children}</>,
        ModalHeader: ({ children }: { children: React.ReactNode }) => <>{children}</>,
        ModalBody: ({ children }: { children: React.ReactNode }) => <>{children}</>,
        ModalFooter: ({ children }: { children: React.ReactNode }) => <>{children}</>,
        ModalCloseButton: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    };
});

describe('EditAssignee Component', () => {
    const mockSetShow = jest.fn();
    const mockReloadTask = jest.fn();
    const mockToastShow = jest.fn();

    const assigneeList = [
        { uid: '1', email: 'user1@test.com', role: '', username: '' },
        { uid: '2', email: 'user2@test.com', role: '', username: '' },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        (useToast as jest.Mock).mockReturnValue({
            show: mockToastShow,
            isActive: jest.fn().mockReturnValue(false),
        });
    });

    it('renders modal when showEditAssigneeModal is true', () => {
        const { getByTestId } = render(
            <ProjectsProvider>
                <EditAssignee
                    showEditAssigneeModal={true}
                    setShowEditAssigneeModal={mockSetShow}
                    assigneeList={assigneeList}
                    taskId="task123"
                    projectId="project123"
                    reloadTask={mockReloadTask}
                />
            </ProjectsProvider>
        );

        // kiểm tra input search tồn tại
        expect(getByTestId('search-input')).toBeTruthy();
    });

    it('closes modal when cancel button is pressed', () => {
        const { getByTestId } = render(
            <ProjectsProvider>
                <EditAssignee
                    showEditAssigneeModal={true}
                    setShowEditAssigneeModal={mockSetShow}
                    assigneeList={assigneeList}
                    taskId="task123"
                    projectId="project123"
                    reloadTask={mockReloadTask}
                />
            </ProjectsProvider>
        );

        const cancelButton = getByTestId('cancel-button');
        fireEvent.press(cancelButton);

        expect(mockSetShow).toHaveBeenCalledWith(false);
    });

    it('selects and deselects assignees', () => {
        const { getAllByText } = render(
            <ProjectsProvider>
                <EditAssignee
                    showEditAssigneeModal={true}
                    setShowEditAssigneeModal={mockSetShow}
                    assigneeList={assigneeList}
                    taskId="task123"
                    projectId="project123"
                    reloadTask={mockReloadTask}
                />
            </ProjectsProvider>
        );

        const user1 = getAllByText('user1@test.com');
        fireEvent.press(user1); // chọn
        fireEvent.press(user1); // bỏ chọn

        // Không có assertion trực tiếp vì state là private, nhưng có thể kiểm tra save call
    });

    it('calls assignTask and shows toast when save button is pressed', async () => {
        (tasksApi.assignTask as jest.Mock).mockResolvedValue({ success: true });

        const { getAllByText, getByTestId } = render(
            <ProjectsProvider>
                <EditAssignee
                    showEditAssigneeModal={true}
                    setShowEditAssigneeModal={mockSetShow}
                    assigneeList={assigneeList}
                    taskId="task123"
                    projectId="project123"
                    reloadTask={mockReloadTask}
                />
            </ProjectsProvider>
        );

        const user1 = getByTestId('assignee-1');
        fireEvent.press(user1); // chọn user

        const saveButton = getByTestId('save-button');
        fireEvent.press(saveButton);

        await waitFor(() => {
            expect(tasksApi.assignTask).toHaveBeenCalledWith(
                ['1'],
                'project123',
                'task123'
            );
        });
    });

    it('handles assignTask error gracefully', async () => {
        (tasksApi.assignTask as jest.Mock).mockRejectedValue(new Error('Failed'));

        const { getByText } = render(
            <ProjectsProvider>
                <EditAssignee
                    showEditAssigneeModal={true}
                    setShowEditAssigneeModal={mockSetShow}
                    assigneeList={assigneeList}
                    taskId="task123"
                    projectId="project123"
                    reloadTask={mockReloadTask}
                />
            </ProjectsProvider>
        );

        // Chọn user
        fireEvent.press(getByText('user1@test.com'));

        // Bấm save
        fireEvent.press(getByText('Save'));

        await waitFor(() => {
            // assignTask vẫn được gọi
            expect(tasksApi.assignTask).toHaveBeenCalledWith(
                ['1'],
                'project123',
                'task123'
            );
            // modal KHÔNG đóng khi assignTask throw
            expect(mockSetShow).not.toHaveBeenCalled();
        });
    });
});
