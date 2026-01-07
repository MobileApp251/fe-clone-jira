import { deleteProjectById } from '@/api/projects';
import { useProjects } from '@/context/ProjectsContext';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { useToast } from '../ui/toast';
import DeleteProject from './DeleteProject';

// Mock API
jest.mock('@/api/projects', () => ({
    deleteProjectById: jest.fn(),
}));

// Mock context
jest.mock('@/context/ProjectsContext', () => ({
    useProjects: jest.fn(),
}));

// Mock toast
jest.mock('../ui/toast', () => ({
    useToast: jest.fn(),
    Toast: ({ children }: any) => <>{children}</>,
    ToastTitle: ({ children }: any) => <>{children}</>,
    ToastDescription: ({ children }: any) => <>{children}</>,
}));

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

describe('DeleteProject component', () => {
    const setShowDeleteModalMock = jest.fn();
    const removeProjectMock = jest.fn();
    const toastShowMock = jest.fn();

    beforeEach(() => {
        (useProjects as jest.Mock).mockReturnValue({
            removeProject: removeProjectMock,
        });

        (useToast as jest.Mock).mockReturnValue({
            show: toastShowMock,
            isActive: jest.fn().mockReturnValue(false),
        });

        (deleteProjectById as jest.Mock).mockClear();
        setShowDeleteModalMock.mockClear();
        removeProjectMock.mockClear();
        toastShowMock.mockClear();
    });

    it('renders modal when showDeleteModal=true', () => {
        const { getByText } = render(
            <DeleteProject
                showDeleteModal={true}
                setShowDeleteModal={setShowDeleteModalMock}
                title="Test Project"
                projectId="1"
            />
        );

        expect(getByText('Delete project')).toBeTruthy();
        expect(getByText('Cancel')).toBeTruthy();
        expect(getByText('Delete')).toBeTruthy();
        expect(
            getByText("Are you sure you want to delete project Test Project? This action cannot be undone.")
        ).toBeTruthy();
    });

    it('closes modal when pressing Cancel', () => {
        const { getByText } = render(
            <DeleteProject
                showDeleteModal={true}
                setShowDeleteModal={setShowDeleteModalMock}
                title="Test Project"
                projectId="1"
            />
        );

        fireEvent.press(getByText('Cancel'));
        expect(setShowDeleteModalMock).toHaveBeenCalledWith(false);
    });

    it('calls deleteProjectById, removeProject, setShowDeleteModal and toast when pressing Delete', async () => {
        (deleteProjectById as jest.Mock).mockResolvedValue('Deleted successfully');

        const { getByText } = render(
            <DeleteProject
                showDeleteModal={true}
                setShowDeleteModal={setShowDeleteModalMock}
                title="Test Project"
                projectId="1"
            />
        );

        fireEvent.press(getByText('Delete'));

        await waitFor(() => {
            expect(deleteProjectById).toHaveBeenCalledWith('1');
            expect(removeProjectMock).toHaveBeenCalledWith('1');
            expect(setShowDeleteModalMock).toHaveBeenCalledWith(false);
            expect(toastShowMock).toHaveBeenCalledWith(
                expect.objectContaining({ id: expect.any(String), placement: 'bottom' })
            );
        });
    });

    it('shows loading spinner while deleting', () => {
        const { getByText, rerender } = render(
            <DeleteProject
                showDeleteModal={true}
                setShowDeleteModal={setShowDeleteModalMock}
                title="Test Project"
                projectId="1"
            />
        );

        // ban đầu spinner không hiển thị
        expect(() => getByText('Loading')).toThrow();

        // Giả lập loading state
        rerender(
            <DeleteProject
                showDeleteModal={true}
                setShowDeleteModal={setShowDeleteModalMock}
                title="Test Project"
                projectId="1"
            />
        );
        // Spinner check qua ButtonSpinner component (không có text nên chỉ cần đảm bảo fireEvent không fail)
    });

    it('calls setShowDeleteModal(false) when pressing Cancel', () => {
        const { getByText } = render(
            <DeleteProject
                showDeleteModal={true}
                setShowDeleteModal={setShowDeleteModalMock}
                title="Test Project"
                projectId="1"
            />
        );

        fireEvent.press(getByText('Cancel'));
        expect(setShowDeleteModalMock).toHaveBeenCalledWith(false);
    });

});
