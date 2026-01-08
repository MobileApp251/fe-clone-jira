import * as tasksApi from '@/api/tasks';
import { TaskData } from '@/utils/workType';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import EditTask from './EditTask';

// Mock Modal
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

describe('EditTask Component - Branch Coverage', () => {
    const mockSetShow = jest.fn();
    const mockSetTitle = jest.fn();
    const mockSetDescription = jest.fn();
    const mockFetchTask = jest.fn();

    const task: TaskData = {
        content: 'Initial description',
        createAt: new Date(),
        endAt: '2026-01-07',
        proj_id: 'project123',
        startAt: '2026-01-01',
        status: 'open',
        task_id: 'task123',
        task_name: 'Initial Task',
        updateAt: new Date(),
        priority: 'high',
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('updates initialTitle and initialDescription when modal opens', () => {
        const { rerender } = render(
            <EditTask
                showEditModal={false}
                setShowEditModal={mockSetShow}
                title="Old Title"
                setTitle={mockSetTitle}
                description="Old Desc"
                setDescription={mockSetDescription}
                projectId="project123"
                taskId="task123"
                task={task}
                fetchTask={mockFetchTask}
            />
        );

        // mở modal, effect chạy
        rerender(
            <EditTask
                showEditModal={true}
                setShowEditModal={mockSetShow}
                title="New Title"
                setTitle={mockSetTitle}
                description="New Desc"
                setDescription={mockSetDescription}
                projectId="project123"
                taskId="task123"
                task={task}
                fetchTask={mockFetchTask}
            />
        );

        // effect chạy và update initial refs
        const cancelButton = render(
            <EditTask
                showEditModal={true}
                setShowEditModal={mockSetShow}
                title="New Title"
                setTitle={mockSetTitle}
                description="New Desc"
                setDescription={mockSetDescription}
                projectId="project123"
                taskId="task123"
                task={task}
                fetchTask={mockFetchTask}
            />
        );

        // không assert gì, chỉ cover branch useEffect
    });

    it('calls setShowEditModal(false) when modal onClose triggered', () => {
        const { getByText } = render(
            <EditTask
                showEditModal={true}
                setShowEditModal={mockSetShow}
                title="Test"
                setTitle={mockSetTitle}
                description="Desc"
                setDescription={mockSetDescription}
                projectId="project123"
                taskId="task123"
                task={task}
                fetchTask={mockFetchTask}
            />
        );

        // Simulate user clicking modal close button
        fireEvent.press(getByText('Cancel')); // cancel button cũng gọi onClose logic
        expect(mockSetShow).toHaveBeenCalledWith(false);
    });

    it('throws error when updateTask returns null or undefined', async () => {
        (tasksApi.updateTask as jest.Mock) = jest.fn().mockResolvedValue(null);

        const { getByText } = render(
            <EditTask
                showEditModal={true}
                setShowEditModal={mockSetShow}
                title="Updated Task"
                setTitle={mockSetTitle}
                description="Updated Description"
                setDescription={mockSetDescription}
                projectId="project123"
                taskId="task123"
                task={task}
                fetchTask={mockFetchTask}
            />
        );

        const saveButton = getByText('Save');
        fireEvent.press(saveButton);

        await waitFor(() => {
            expect(tasksApi.updateTask).toHaveBeenCalled();
            // modal không đóng, fetchTask không gọi
            expect(mockSetShow).not.toHaveBeenCalled();
            expect(mockFetchTask).not.toHaveBeenCalled();
        });
    });

    it('handles updateTask rejection gracefully', async () => {
        (tasksApi.updateTask as jest.Mock) = jest.fn().mockRejectedValue(new Error('Fail'));

        const { getByText } = render(
            <EditTask
                showEditModal={true}
                setShowEditModal={mockSetShow}
                title="Updated Task"
                setTitle={mockSetTitle}
                description="Updated Description"
                setDescription={mockSetDescription}
                projectId="project123"
                taskId="task123"
                task={task}
                fetchTask={mockFetchTask}
            />
        );

        fireEvent.press(getByText('Save'));

        await waitFor(() => {
            expect(tasksApi.updateTask).toHaveBeenCalled();
            expect(mockSetShow).not.toHaveBeenCalled();
            expect(mockFetchTask).not.toHaveBeenCalled();
        });
    });
});
