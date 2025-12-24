import * as SecureStore from "expo-secure-store";

const KEY = "ACCESS_TOKEN";

export const tokenStore = {
    get: () => SecureStore.getItemAsync(KEY),
    set: (token: string) => SecureStore.setItemAsync(KEY, token),
    clear: () => SecureStore.deleteItemAsync(KEY),
};
