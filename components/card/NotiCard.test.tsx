import { NotifyType } from '@/utils/notification';
import { render } from '@testing-library/react-native';
import React from 'react';
import NotiCard from '../card/NotiCard';

describe('NotiCard', () => {
    const defaultProps = {
        title: 'New Task Assigned',
        description: 'You have been assigned a new task: Design Homepage',
        notifyType: 'system' as NotifyType,
        time: '10:30 AM',
    };

    it('renders title, description and time correctly', () => {
        const { getByText } = render(<NotiCard {...defaultProps} />);
        expect(getByText('New Task Assigned')).toBeTruthy();
        expect(getByText('You have been assigned a new task: Design Homepage')).toBeTruthy();
        expect(getByText('10:30 AM')).toBeTruthy();
    });

    it('renders notifyType content', () => {
        const { getByText } = render(<NotiCard {...defaultProps} />);
        expect(getByText('system')).toBeTruthy(); // test string NotifyType
    });
});
