import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

const onboardingData = [
  {
    id: '1',
    title: 'Chào mừng đến với ứng dụng',
    description:
      'Khám phá những tính năng tuyệt vời giúp cuộc sống của bạn dễ dàng hơn',
  },
  {
    id: '2',
    title: 'Dễ dàng sử dụng',
    description:
      'Giao diện thân thiện, dễ dàng thao tác và quản lý công việc hàng ngày',
  },
  {
    id: '3',
    title: 'Bắt đầu ngay',
    description:
      'Đăng nhập và trải nghiệm tất cả các tính năng tuyệt vời của chúng tôi',
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
      await AsyncStorage.setItem('@viewedOnboarding', 'true');
      router.replace('/login');
    }
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem('@viewedOnboarding', 'true');
    router.replace('/login');
  };

  const onScroll = (event: any) => {
    const { contentOffset } = event.nativeEvent;
    const index = Math.round(
      contentOffset.x / event.nativeEvent.layoutMeasurement.width
    );
    setCurrentIndex(index);
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {currentIndex < onboardingData.length - 1 && (
        <TouchableOpacity style={styles.skipButtonTop} onPress={handleSkip}>
          <Text style={styles.skipText}>Bỏ qua</Text>
        </TouchableOpacity>
      )}

      {/* FlatList hiển thị nội dung onboarding */}
      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      />

      {/* Indicator */}
      <View style={styles.indicatorContainer}>
        {onboardingData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicatorDot,
              {
                backgroundColor:
                  currentIndex === index ? '#007AFF' : '#E5E5E5',
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.nextButtonContainer}>
        {currentIndex === onboardingData.length - 1 && (
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextText}>Bắt đầu</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

// -------------------- STYLES --------------------
const styles = StyleSheet.create({
  slide: {
    width,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    lineHeight: 24,
  },

  skipButtonTop: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 2,
    padding: 8,
  },
  skipText: {
    fontSize: 16,
    color: '#666',
  },

  // Indicator
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },

  nextButtonContainer: {
    position: 'absolute',
    bottom: 140,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 25,
  },
  nextText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
});
