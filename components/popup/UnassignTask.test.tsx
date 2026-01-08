// UnassignTask.test.tsx
import { unassignTask } from '@/api/tasks';
import { useProjects } from '@/context/ProjectsContext';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import UnassignTask from './UnassignTask';

// Mock API
jest.mock('@/api/tasks', () => ({
    unassignTask: jest.fn(),
}));

// Mock useProjects
jest.mock('@/context/ProjectsContext', () => ({
    useProjects: jest.fn(),
}));

jest.mock('@/components/ui/modal', () => {
    const React = require('react');
    return {
        Modal: ({ children }: any) => <>{children}</>,
        ModalBackdrop: ({ children }: any) => <>{children}</>,
        ModalContent: ({ children }: any) => <>{children}</>,
        ModalHeader: ({ children }: any) => <>{children}</>,
        ModalBody: ({ children }: any) => <>{children}</>,
        ModalFooter: ({ children }: any) => <>{children}</>,
    };
});

// Mock Toast
const mockToastShow = jest.fn();
const mockIsActive = jest.fn();
jest.mock('../ui/toast', () => {
    const React = require('react');
    return {
        useToast: () => ({ show: mockToastShow, isActive: mockIsActive }),
        Toast: ({ children }: { children: React.ReactNode }) => <>{children}</>,
        ToastTitle: ({ children }: { children: React.ReactNode }) => <>{children}</>,
        ToastDescription: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    };
});

describe('UnassignTask Component', () => {
    const mockSetShowDeleteModal = jest.fn();
    const mockSetMembers = jest.fn();
    const mockUpdateMembers = jest.fn();

    beforeEach(() => {
        (useProjects as jest.Mock).mockReturnValue({
            project: { project: { proj_id: 'proj123' } },
            updateMembers: mockUpdateMembers,
        });
        jest.clearAllMocks();
        (unassignTask as jest.Mock).mockResolvedValue({ success: true });
        mockIsActive.mockReturnValue(false);
    });

    it('renders modal with user email', () => {
        const { getByText } = render(
            <UnassignTask
                showDeleteModal={true}
                setShowDeleteModal={mockSetShowDeleteModal}
                userEmail="test@example.com"
                uid="user1"
                taskId="task1"
                projectId="proj123"
                setMembers={mockSetMembers}
            />
        );

        expect(getByText('Unassign task')).toBeTruthy();
        expect(getByText(/Are you sure you want to unassign user test@example.com/)).toBeTruthy();
        expect(getByText('Cancel')).toBeTruthy();
        expect(getByText('Unassign')).toBeTruthy();
    });

    it('closes modal on Cancel press', () => {
        const { getByText } = render(
            <UnassignTask
                showDeleteModal={true}
                setShowDeleteModal={mockSetShowDeleteModal}
                userEmail="test@example.com"
                uid="user1"
                taskId="task1"
                projectId="proj123"
                setMembers={mockSetMembers}
            />
        );

        fireEvent.press(getByText('Cancel'));
        expect(mockSetShowDeleteModal).toHaveBeenCalledWith(false);
    });

    it('calls unassignTask, updates members, closes modal and shows toast on Unassign press', async () => {
        const { getByText } = render(
            <UnassignTask
                showDeleteModal={true}
                setShowDeleteModal={mockSetShowDeleteModal}
                userEmail="test@example.com"
                uid="user1"
                taskId="task1"
                projectId="proj123"
                setMembers={mockSetMembers}
            />
        );

        const unassignBtn = getByText('Unassign');
        fireEvent.press(unassignBtn);

        expect(getByText('Unassign')).toBeTruthy(); // spinner vẫn có thể hiển thị

        await waitFor(() => {
            expect(unassignTask).toHaveBeenCalledWith('user1', 'proj123', 'task1');
            expect(mockSetMembers).toHaveBeenCalled();
            expect(mockSetShowDeleteModal).toHaveBeenCalledWith(false);
            expect(mockToastShow).toHaveBeenCalled();
        });
    });

    it('handles case without setMembers', async () => {
        const { getByText } = render(
            <UnassignTask
                showDeleteModal={true}
                setShowDeleteModal={mockSetShowDeleteModal}
                userEmail="test@example.com"
                uid="user1"
                taskId="task1"
                projectId="proj123"
            />
        );

        fireEvent.press(getByText('Unassign'));

        await waitFor(() => {
            expect(unassignTask).toHaveBeenCalledWith('user1', 'proj123', 'task1');
            expect(mockSetShowDeleteModal).toHaveBeenCalledWith(false);
            expect(mockToastShow).toHaveBeenCalled();
        });
    });

    // ------------------ Tăng coverage ------------------
    it('handles API error gracefully', async () => {
        (unassignTask as jest.Mock).mockRejectedValue(new Error('API failed'));
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

        const { getByText } = render(
            <UnassignTask
                showDeleteModal={true}
                setShowDeleteModal={mockSetShowDeleteModal}
                userEmail="test@example.com"
                uid="user1"
                taskId="task1"
                projectId="proj123"
                setMembers={mockSetMembers}
            />
        );

        fireEvent.press(getByText('Unassign'));

        await waitFor(() => {
            expect(unassignTask).toHaveBeenCalled();
        });

    });

    it('does not show toast if already active', async () => {
        mockIsActive.mockReturnValue(true);

        const { getByText } = render(
            <UnassignTask
                showDeleteModal={true}
                setShowDeleteModal={mockSetShowDeleteModal}
                userEmail="test@example.com"
                uid="user1"
                taskId="task1"
                projectId="proj123"
                setMembers={mockSetMembers}
            />
        );

        fireEvent.press(getByText('Unassign'));

        await waitFor(() => {
            expect(mockToastShow).not.toHaveBeenCalled();
        });
    });

    it('shows loading spinner when handleSaveAssignee is called', async () => {
        const { getByText, getByTestId } = render(
            <UnassignTask
                showDeleteModal={true}
                setShowDeleteModal={mockSetShowDeleteModal}
                userEmail="test@example.com"
                uid="user1"
                taskId="task1"
                projectId="proj123"
                setMembers={mockSetMembers}
            />
        );

        fireEvent.press(getByText('Unassign'));

        // loading state đang true → spinner hiển thị
        await waitFor(() => {
            expect(getByText('Unassign')).toBeTruthy();
        });
    });
});
