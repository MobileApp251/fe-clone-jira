import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import SearchBar from './SearchBar';

describe('SearchBar', () => {
    it('renders input with placeholder', () => {
        const { getByPlaceholderText } = render(
            <SearchBar page="onlySearch" value="" onChange={jest.fn()} />
        );

        expect(getByPlaceholderText('Enter text here...')).toBeTruthy();
    });

    it('renders create and filter buttons on project page', () => {
        const onCreatePressMock = jest.fn();
        const onFilterPressMock = jest.fn();

        const { getByTestId } = render(
            <SearchBar
                page="project"
                value=""
                onChange={jest.fn()}
                onCreatePress={onCreatePressMock}
                onFilterPress={onFilterPressMock}
            />
        );

        // nút create
        const createBtn = getByTestId('create-button');
        expect(createBtn).toBeTruthy();
        fireEvent.press(createBtn);
        expect(onCreatePressMock).toHaveBeenCalled();

        // nút filter
        const filterBtn = getByTestId('filter-button');
        expect(filterBtn).toBeTruthy();
        fireEvent.press(filterBtn);
        expect(onFilterPressMock).toHaveBeenCalled();
    });

    it('does not render create button on task page', () => {
        const { queryByTestId } = render(
            <SearchBar
                page="task"
                value=""
                onChange={jest.fn()}
                onCreatePress={jest.fn()}
                onFilterPress={jest.fn()}
            />
        );

        expect(queryByTestId('create-button')).toBeNull();
        expect(queryByTestId('filter-button')).toBeTruthy();
    });

    it('calls onChange when typing', () => {
        const onChangeMock = jest.fn();
        const { getByPlaceholderText } = render(
            <SearchBar page="onlySearch" value="" onChange={onChangeMock} />
        );

        const input = getByPlaceholderText('Enter text here...');
        fireEvent.changeText(input, 'Hello World');
        expect(onChangeMock).toHaveBeenCalledWith('Hello World');
    });
});
