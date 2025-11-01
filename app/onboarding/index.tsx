import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    FlatList,
    StatusBar,
    View,
} from 'react-native';
import OnboardingScreen from './onboarding-screen';

const onboardingData = [
  {
    id: '1',
    title: 'Chào mừng đến với ứng dụng',
    description: 'Khám phá những tính năng tuyệt vời giúp cuộc sống của bạn dễ dàng hơn'
  },
  {
    id: '2',
    title: 'Dễ dàng sử dụng',
    description: 'Giao diện thân thiện, dễ dàng thao tác và quản lý công việc hàng ngày'
  },
  {
    id: '3',
    title: 'Bắt đầu ngay',
    description: 'Đăng nhập và trải nghiệm tất cả các tính năng tuyệt vời của chúng tôi'
  },
];

export default function Onboarding() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();

  const handleNext = async () => {
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex });
      setCurrentIndex(nextIndex);
    } else {
      // Đánh dấu đã xem onboarding và chuyển đến login
      await AsyncStorage.setItem('@viewedOnboarding', 'true');
      router.replace('/login');
    }
  };

  const handleSkip = async () => {
    // Đánh dấu đã xem onboarding và chuyển đến login
    await AsyncStorage.setItem('@viewedOnboarding', 'true');
    router.replace('/login');
  };

  const onScroll = (event: any) => {
    const { contentOffset } = event.nativeEvent;
    const index = Math.round(contentOffset.x / event.nativeEvent.layoutMeasurement.width);
    setCurrentIndex(index);
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={({ item, index }) => (
          <OnboardingScreen
            item={item}
            isLast={index === onboardingData.length - 1}
            onNext={handleNext}
            onSkip={handleSkip}
          />
        )}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      />

      {/* Indicator */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 100,
        left: 0,
        right: 0,
      }}>
        {onboardingData.map((_, index) => (
          <View
            key={index}
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: currentIndex === index ? '#007AFF' : '#E5E5E5',
              marginHorizontal: 4,
            }}
          />
        ))}
      </View>
    </View>
  );
}