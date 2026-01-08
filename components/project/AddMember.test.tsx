jest.mock('@/context/ProjectsContext', () => ({
    useProjects: jest.fn(),
}));

jest.mock('../ui/toast', () => {
    return {
        useToast: jest.fn(() => ({
            show: jest.fn(),
            isActive: jest.fn().mockReturnValue(false),
        })),
        Toast: ({ children }: any) => children,
        ToastTitle: ({ children }: any) => children,
        ToastDescription: ({ children }: any) => children,
    };
});

jest.mock('@/api/users', () => ({
    searchUserByEmailPattern: jest.fn(),
}));

jest.mock('@/api/projects', () => ({
    addMembers: jest.fn(),
}));

import { addMembers } from '@/api/projects';
import { searchUserByEmailPattern } from '@/api/users';
import { useProjects } from '@/context/ProjectsContext';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import AddMemberModal from './AddMember';

jest.useFakeTimers();

describe('AddMemberModal', () => {
    const onClose = jest.fn();
    const updateMembers = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        (useProjects as jest.Mock).mockReturnValue({
            project: {
                project: { proj_id: '1' },
            },
            updateMembers,
        });
    });

    it('renders modal when visible', () => {
        const { getByText } = render(
            <AddMemberModal visible onClose={jest.fn()} />
        );

        expect(getByText('Add member')).toBeTruthy();
    });

    it('searches members when typing', async () => {
        (searchUserByEmailPattern as jest.Mock).mockResolvedValue([
            'test@email.com',
        ]);

        const { getByText, getByPlaceholderText } = render(
            <AddMemberModal visible onClose={onClose} />
        );

        fireEvent.changeText(
            getByPlaceholderText('Enter text here...'),
            'test@email.com'
        );
        jest.runAllTimers();

        await waitFor(() => {
            expect(searchUserByEmailPattern).toHaveBeenCalledWith('test@email.com');
        });

        expect(getByText('test@email.com')).toBeTruthy();
    });

    it('selects and unselects member', async () => {
        (searchUserByEmailPattern as jest.Mock).mockResolvedValue([
            'test@email.com',
        ]);

        const { getByText, getByPlaceholderText, getByTestId } = render(
            <AddMemberModal visible onClose={onClose} />
        );

        fireEvent.changeText(
            getByPlaceholderText('Enter text here...'),
            'test@email.com'
        );

        jest.runAllTimers();

        const member = await waitFor(() =>
            getByText('test@email.com')
        );

        const addButton = getByTestId('add-member-button');

        // disabled
        expect(addButton.props.accessibilityState.disabled).toBe(true);

        // select
        fireEvent.press(member);

        await waitFor(() => {
            expect(addButton.props.accessibilityState.disabled).toBe(true);
        });

        // unselect
        fireEvent.press(member);

        await waitFor(() => {
            expect(addButton.props.accessibilityState.disabled).toBe(true);
        });
    });
    it('does not add member when none selected', async () => {
        const { getByText } = render(
            <AddMemberModal visible onClose={onClose} />
        );

        fireEvent.press(getByText('Add new member'));

        expect(addMembers as jest.Mock).not.toHaveBeenCalled();
    });

    it('adds members successfully', async () => {
        (searchUserByEmailPattern as jest.Mock).mockResolvedValue([
            'test@email.com',
        ]);

        (addMembers as jest.Mock).mockResolvedValue([
            { email: 'test@email.com', success: true },
        ]);

        const { getByText, getByPlaceholderText, getAllByTestId } = render(
            <AddMemberModal visible onClose={onClose} />
        );

        // nhập search
        fireEvent.changeText(
            getByPlaceholderText('Enter text here...'),
            'test@email.com'
        );

        // chạy debounce
        jest.runAllTimers();

        // press checkbox của member
        const checkbox = await waitFor(() =>
            getAllByTestId('checkbox')[0]
        );
        fireEvent.press(checkbox);

        // add
        fireEvent.press(getByText('Add new member'));

        await waitFor(() => {
            expect(addMembers).toHaveBeenCalledWith('1', ['test@email.com']);
            expect(updateMembers).toHaveBeenCalledWith('1');
            expect(onClose).toHaveBeenCalled();
        });
    });

    it('closes modal when cancel pressed', () => {
        const { getByText } = render(
            <AddMemberModal visible onClose={onClose} />
        );

        fireEvent.press(getByText('Cancel'));
        expect(onClose).toHaveBeenCalled();
    });
});
