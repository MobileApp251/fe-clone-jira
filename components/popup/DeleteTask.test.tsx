import { deleteTask } from '@/api/tasks';
import { useProjects } from '@/context/ProjectsContext';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { useRouter } from 'expo-router';
import React from 'react';
import { useToast } from '../ui/toast';
import DeleteTask from './DeleteTask';

// --- Mock API ---
jest.mock('@/api/tasks', () => ({
    deleteTask: jest.fn(),
}));

// --- Mock context ---
jest.mock('@/context/ProjectsContext', () => ({
    useProjects: jest.fn(),
}));

// --- Mock toast ---
jest.mock('../ui/toast', () => ({
    useToast: jest.fn(),
    Toast: ({ children }: any) => <>{children}</>,
    ToastTitle: ({ children }: any) => <>{children}</>,
    ToastDescription: ({ children }: any) => <>{children}</>,
}));

// --- Mock router ---
jest.mock('expo-router', () => ({
    useRouter: jest.fn(),
}));

// --- Mock Modal (Portal) ---
jest.mock('@/components/ui/modal', () => {
    const React = require('react');
    const { View } = require('react-native');
    return {
        Modal: ({ children }: any) => <View>{children}</View>,
        ModalBackdrop: ({ children }: any) => <View>{children}</View>,
        ModalContent: ({ children }: any) => <View>{children}</View>,
        ModalHeader: ({ children }: any) => <View>{children}</View>,
        ModalBody: ({ children }: any) => <View>{children}</View>,
        ModalFooter: ({ children }: any) => <View>{children}</View>,
    };
});

describe('DeleteTask component', () => {
    let setShowDeleteModalMock: jest.Mock;
    let removeTaskMock: jest.Mock;
    let toastShowMock: jest.Mock;
    let routerReplaceMock: jest.Mock;

    beforeEach(() => {
        setShowDeleteModalMock = jest.fn();
        removeTaskMock = jest.fn();
        toastShowMock = jest.fn();
        routerReplaceMock = jest.fn();

        (useProjects as jest.Mock).mockReturnValue({
            removeTask: removeTaskMock,
            projectTasks: [],
        });

        (useToast as jest.Mock).mockReturnValue({
            show: toastShowMock,
            isActive: jest.fn().mockReturnValue(false),
        });

        (useRouter as jest.Mock).mockReturnValue({
            replace: routerReplaceMock,
        });

        (deleteTask as jest.Mock).mockClear();
        setShowDeleteModalMock.mockClear();
        removeTaskMock.mockClear();
        toastShowMock.mockClear();
        routerReplaceMock.mockClear();
    });

    // --- Branch 1: modal render ---
    it('renders modal correctly', () => {
        const { getByText } = render(
            <DeleteTask
                showDeleteModal={true}
                setShowDeleteModal={setShowDeleteModalMock}
                title="Test Task"
                projectId="1"
                taskId="101"
            />
        );

        expect(getByText('Delete project task')).toBeTruthy();
        expect(getByText('Cancel')).toBeTruthy();
        expect(getByText('Delete')).toBeTruthy();
        expect(getByText(/Are you sure you want to delete task/i)).toBeTruthy();
        expect(getByText(/Test Task/i)).toBeTruthy();
    });

    // --- Branch 2: cancel button ---
    it('closes modal when pressing Cancel', () => {
        const { getByText } = render(
            <DeleteTask
                showDeleteModal={true}
                setShowDeleteModal={setShowDeleteModalMock}
                title="Test Task"
                projectId="1"
                taskId="101"
            />
        );

        fireEvent.press(getByText('Cancel'));
        expect(setShowDeleteModalMock).toHaveBeenCalledWith(false);
    });

    // --- Branch 3: delete task success ---
    it('calls deleteTask, removeTask, closes modal and shows toast', async () => {
        (deleteTask as jest.Mock).mockResolvedValue('Deleted successfully');

        const { getByText } = render(
            <DeleteTask
                showDeleteModal={true}
                setShowDeleteModal={setShowDeleteModalMock}
                title="Test Task"
                projectId="1"
                taskId="101"
            />
        );

        fireEvent.press(getByText('Delete'));

        await waitFor(() => {
            expect(deleteTask).toHaveBeenCalledWith('1', '101');
            expect(removeTaskMock).toHaveBeenCalledWith('101');
            expect(setShowDeleteModalMock).toHaveBeenCalledWith(false);
            expect(toastShowMock).toHaveBeenCalledWith(expect.objectContaining({ id: expect.any(String) }));
        });
    });

    // --- Branch 4: delete task with onTaskDetail redirect ---
    it('redirects when onTaskDetail=true', async () => {
        (deleteTask as jest.Mock).mockResolvedValue('Deleted');

        jest.useFakeTimers();

        const { getByText } = render(
            <DeleteTask
                showDeleteModal={true}
                setShowDeleteModal={setShowDeleteModalMock}
                title="Test Task"
                projectId="1"
                taskId="101"
                onTaskDetail={true} // Đảm bảo truyền boolean true
            />
        );

        fireEvent.press(getByText('Delete'));

        // Chờ API call hoàn thành
        await waitFor(() => {
            expect(deleteTask).toHaveBeenCalledWith('1', '101');
        });

        // Đảm bảo loading state đã được set
        await waitFor(() => {
            expect(setShowDeleteModalMock).toHaveBeenCalledWith(false);
        });

        // QUAN TRỌNG: Advance timer đủ 3000ms cho setTimeout
        jest.advanceTimersByTime(3000);

        // Chạy tất cả timers
        jest.runAllTimers();

        // Kiểm tra router.replace được gọi
        await waitFor(() => {
            expect(routerReplaceMock).toHaveBeenCalledWith({
                pathname: '/dashboard/projects/[id]',
                params: { id: '1', actionTaskId: '101' },
            });
        });

        jest.useRealTimers();
    });

    // --- Branch 5: delete task API throws error ---
    it('still closes modal and shows toast if deleteTask throws', async () => {
        (deleteTask as jest.Mock).mockRejectedValue(new Error('API Error'));

        const { getByText } = render(
            <DeleteTask
                showDeleteModal={true}
                setShowDeleteModal={setShowDeleteModalMock}
                title="Test Task"
                projectId="1"
                taskId="101"
            />
        );

        fireEvent.press(getByText('Delete'));

        await waitFor(() => {
            expect(setShowDeleteModalMock).toHaveBeenCalledWith(false);
            expect(removeTaskMock).not.toHaveBeenCalled();
            expect(toastShowMock).toHaveBeenCalledWith(expect.objectContaining({ id: expect.any(String) }));
        });
    });

    // --- Branch 6: loading spinner appears ---
    it('shows loading spinner while deleting', async () => {
        let resolveFn: Function;
        (deleteTask as jest.Mock).mockImplementation(
            () =>
                new Promise((resolve) => {
                    resolveFn = resolve;
                })
        );

        const { getByText, queryByTestId } = render(
            <DeleteTask
                showDeleteModal={true}
                setShowDeleteModal={setShowDeleteModalMock}
                title="Test Task"
                projectId="1"
                taskId="101"
            />
        );

        fireEvent.press(getByText('Delete'));

        // Spinner xuất hiện
        expect(queryByTestId('button-spinner')).toBeTruthy();

        // Resolve promise
        resolveFn!('Deleted successfully');

        await waitFor(() => {
            expect(setShowDeleteModalMock).toHaveBeenCalled();
        });
    });
});
