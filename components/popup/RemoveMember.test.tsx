import * as projectsApi from '@/api/projects';
import { useProjects } from '@/context/ProjectsContext';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import RemoveMember from './RemoveMember';

// Mock useProjects
jest.mock('@/context/ProjectsContext', () => ({
    useProjects: jest.fn(),
}));

// Mock Modal để test pass
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

// Mock Toast
const mockToastShow = jest.fn();
jest.mock('../ui/toast', () => {
    const React = require('react');
    return {
        useToast: () => ({ show: mockToastShow, isActive: jest.fn().mockReturnValue(false) }),
        Toast: ({ children }: { children: React.ReactNode }) => <>{children}</>,
        ToastTitle: ({ children }: { children: React.ReactNode }) => <>{children}</>,
        ToastDescription: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    };
});

describe('RemoveMember Component', () => {
    const mockSetShow = jest.fn();
    const mockUpdateMembers = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useProjects as jest.Mock).mockReturnValue({
            project: { project: { proj_id: 'project123' } },
            updateMembers: mockUpdateMembers,
        });
    });

    it('renders modal with user email', () => {
        const { getByText } = render(
            <RemoveMember
                showDeleteModal={true}
                setShowDeleteModal={mockSetShow}
                userEmail="user@test.com"
                uid="user1"
            />
        );

        expect(getByText('Remove member')).toBeTruthy();
        expect(getByText(/user@test.com/)).toBeTruthy();
    });

    it('closes modal when cancel button pressed', () => {
        const { getByText } = render(
            <RemoveMember
                showDeleteModal={true}
                setShowDeleteModal={mockSetShow}
                userEmail="user@test.com"
                uid="user1"
            />
        );

        fireEvent.press(getByText('Cancel'));
        expect(mockSetShow).toHaveBeenCalledWith(false);
    });

    it('calls removeMembers and shows toast when delete pressed', async () => {
        (projectsApi.removeMembers as jest.Mock) = jest.fn().mockResolvedValue({ success: true });

        const { getByText } = render(
            <RemoveMember
                showDeleteModal={true}
                setShowDeleteModal={mockSetShow}
                userEmail="user@test.com"
                uid="user1"
            />
        );

        fireEvent.press(getByText('Delete'));

        await waitFor(() => {
            expect(projectsApi.removeMembers).toHaveBeenCalledWith('project123', 'user1');
            expect(mockUpdateMembers).toHaveBeenCalledWith('project123');
            expect(mockToastShow).toHaveBeenCalled();
            expect(mockSetShow).toHaveBeenCalledWith(false);
        });
    });

    it('handles removeMembers failure gracefully', async () => {
        (projectsApi.removeMembers as jest.Mock) = jest.fn().mockRejectedValue(new Error('Fail'));

        const { getByText } = render(
            <RemoveMember
                showDeleteModal={true}
                setShowDeleteModal={mockSetShow}
                userEmail="user@test.com"
                uid="user1"
            />
        );

        fireEvent.press(getByText('Delete'));

        await waitFor(() => {
            expect(projectsApi.removeMembers).toHaveBeenCalledWith('project123', 'user1');
            // Khi lỗi, modal vẫn đóng theo finally
            expect(mockSetShow).toHaveBeenCalledWith(false);
        });
    });
});
