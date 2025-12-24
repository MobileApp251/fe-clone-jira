import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIwYTExZTZiNC05YjRmLTE2NDMtODE5Yi00Zjk4MDMyNjAwMDAiLCJpYXQiOjE3NjY1NjY5MjEsImV4cCI6MTc2NjY1MzMyMX0.kBVLp4Eo12pXpulhmvcxrGPhWL19MhZ557M8AWmPjAU';

export const tokenStore = {
    get: () => SecureStore.getItemAsync(ACCESS_TOKEN),
    set: (token: string) => SecureStore.setItemAsync(ACCESS_TOKEN, token),
    clear: () => SecureStore.deleteItemAsync(ACCESS_TOKEN),
};
