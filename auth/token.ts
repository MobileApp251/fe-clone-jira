import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIwYTExOTIyNy05YjRlLTFjNGItODE5Yi00ZTBmOTc0OTAwMDAiLCJpYXQiOjE3NjY1NDEyMDQsImV4cCI6MTc2NjYyNzYwNH0.uJqyruKCBBtgi4H6hgEpD8jBwz73TLU53MIcu6t9PTY'

export const tokenStore = {
    get: () => SecureStore.getItemAsync(ACCESS_TOKEN),
    set: (token: string) => SecureStore.setItemAsync(ACCESS_TOKEN, token),
    clear: () => SecureStore.deleteItemAsync(ACCESS_TOKEN),
};
