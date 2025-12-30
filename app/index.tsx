import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

const isTokenValid = (token: string) => {
    try {
        const payloadBase64 = token.split('.')[1];
        const payload = JSON.parse(atob(payloadBase64));
        const now = Math.floor(Date.now() / 1000);

        return payload.exp && payload.exp > now;
    } catch {
        return false;
    }
};

export default function Index() {
    const router = useRouter();

    useEffect(() => {
        bootstrap();
    }, []);

    const bootstrap = async () => {
        try {
            const hasViewedOnboarding = await AsyncStorage.getItem('@viewedOnboarding');

            if (hasViewedOnboarding !== 'true') {
                router.replace('/onboarding');
                return;
            }

            const token = await AsyncStorage.getItem('ACCESS_TOKEN');

            if (token && isTokenValid(token)) {
                router.replace('/dashboard');
            } else {
                await AsyncStorage.removeItem('ACCESS_TOKEN');
                router.replace('/login');
            }
        } catch (error) {
            console.error('Bootstrap error:', error);
            router.replace('/login');
        }
    };


    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" />
        </View>
    );
}