import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { useRouter } from 'expo-router';
import React from 'react';
import Onboarding from './index';

jest.mock('expo-router', () => ({
    useRouter: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
    setItem: jest.fn(),
}));

jest.mock('lottie-react-native', () => 'LottieView');

jest.mock('../providers/ThemeProvider', () => ({
    useTheme: () => ({
        colors: {},
    }),
}));

describe('Onboarding', () => {
    const replace = jest.fn();

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({ replace });
        jest.clearAllMocks();
    });

    it('renders first onboarding screen', () => {
        const { getAllByText } = render(<Onboarding />);

        expect(getAllByText('CloneJira').length).toBeGreaterThan(0);
        expect(getAllByText('Bỏ qua').length).toBeGreaterThan(0);
    });

    it('skips onboarding when pressing skip', async () => {
        const { getByText } = render(<Onboarding />);

        fireEvent.press(getByText('Bỏ qua'));

        await waitFor(() => {
            expect(AsyncStorage.setItem).toHaveBeenCalledWith(
                '@viewedOnboarding',
                'true'
            );
            expect(replace).toHaveBeenCalledWith('/login');
        });
    });

    it('shows start button on last slide and navigates', async () => {
        const { getByText, getByTestId } = render(<Onboarding />);

        const flatList = getByTestId('onboarding-flatlist');

        // fake scroll tới slide cuối
        fireEvent.scroll(flatList, {
            nativeEvent: {
                contentOffset: { x: 3 * 375 },
                layoutMeasurement: { width: 375 },
                contentSize: { width: 4 * 375, height: 500 },
            },
        });

        const startButton = await waitFor(() =>
            getByText('Bắt đầu')
        );

        fireEvent.press(startButton);

        await waitFor(() => {
            expect(AsyncStorage.setItem).toHaveBeenCalledWith(
                '@viewedOnboarding',
                'true'
            );
            expect(replace).toHaveBeenCalledWith('/login');
        });
    });
});
