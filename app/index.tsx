import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const hasViewedOnboarding = await AsyncStorage.getItem('@viewedOnboarding');
      
      if (hasViewedOnboarding === 'true') {
        // Đã xem onboarding, chuyển thẳng đến login
        router.replace('/login');
      } else {
        // Chưa xem onboarding, chuyển đến onboarding
        router.replace('/onboarding');
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      // Mặc định chuyển đến onboarding nếu có lỗi
      router.replace('/onboarding');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}