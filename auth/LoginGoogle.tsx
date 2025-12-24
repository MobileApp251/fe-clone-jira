import { API_URL } from '@/config/env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';

export async function loginWithGoogle() {
    const redirectUri = Linking.createURL('auth');

    console.log("Redirect URI: ", redirectUri);

    const state = encodeURIComponent(redirectUri);

    const loginUrl = `${API_URL}/auth/google?state=${state}`;

    console.log("Login url:", loginUrl)

    const result = await WebBrowser.openAuthSessionAsync(
        loginUrl,
        redirectUri
    );

    if (result.type !== 'success' || !result.url) {
        throw new Error('Login cancelled');
    }

    const { queryParams } = Linking.parse(result.url);
    const token = queryParams?.token as string;

    console.log("GET TOKEN: ", token)

    if (!token) {
        throw new Error('No token returned');
    }

    await AsyncStorage.setItem("ACCESS_TOKEN", token);
}
