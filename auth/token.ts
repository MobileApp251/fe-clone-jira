import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIwYTExNDcyOC05YjQzLTE1ZTQtODE5Yi00NDA3NTlmYzAwMDAiLCJpYXQiOjE3NjYzNzI4OTEsImV4cCI6MTc2NjQ1OTI5MX0.Te4-uO2hXw9M_1jdo_VIE0MINJ_ahhMs220GUfx2MP0'

export const tokenStore = {
    getAccessToken: () =>
        SecureStore.getItemAsync(ACCESS_TOKEN),
    setAccessToken: (token: string) =>
        SecureStore.setItemAsync(ACCESS_TOKEN, token),
    removeAccessToken: () =>
        SecureStore.deleteItemAsync(ACCESS_TOKEN),
}