import { Colors } from '@/constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
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
import { useTheme } from '../providers/ThemeProvider';

const { width } = Dimensions.get('window');

const onboardingData = [
  {
    id: '1',
    title: 'CloneJira',
    subtitle: 'No deadline behind',
    animation: require('../../assets/animations/onboarding1.json'),
    subsubtitle:
      'Wellcome to CloneJira',
    description: 'Oraganize projects, collaborate with your team, and track work easily'
  },
  {
    id: '2',
    title: 'Manage Your Projects',
    animation: require('../../assets/animations/onboarding2.json'),
    description:
      'Manage all your projects in one place with clear structure and visibility',
  },
  {
    id: '3',
    title: 'Stay On Schedule',
    animation: require('../../assets/animations/onboarding3.json'),
    description:
      'Stay ahead of your schedule with automatic deadline alerts',
  },
  {
    id: '4',
    title: 'You\'re All Set!',
    animation: require('../../assets/animations/onboarding4.json'),
    description:
      'Start managing your work with ease',
  },
];

export default function Onboarding() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();
  const { colors } = useTheme();

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

      {currentIndex < onboardingData.length && (
        <View style={styles.topBar}>
          <Text style={styles.headerText}>CloneJira</Text>

          <TouchableOpacity style={styles.skipButtonTop} onPress={handleSkip}>
            <Text style={styles.skipText}>Bỏ qua</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* FlatList hiển thị nội dung onboarding */}
      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <LottieView
              source={item.animation}
              autoPlay
              loop
              style={styles.animation}
            />
            <Text style={styles.title}>{item.title}</Text>
            {item.subtitle ? (
              <Text style={styles.subtitle}>{item.subtitle}</Text>
            ) : null}
            {item.subsubtitle ? (
              <Text style={styles.subsubtitle}>{item.subsubtitle}</Text>
            ) : null}
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
const screenWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  topBar: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 14,
    fontWeight: 'bold',
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 2,
    padding: 8,
    paddingLeft: 20,
    paddingRight: 20,
    color: Colors.light.primary,
  },
  slide: {
    width,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 0,
    color: Colors.light.primary
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.primary,
    marginBottom: 50
  },
  subsubtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text_primary,
  },
  animation: {
    width: screenWidth * 0.7,
    height: screenWidth * 0.7,
  },
  description: {
    marginTop: 40,
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    lineHeight: 24,
  },

  skipButtonTop: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 2,
    padding: 8,
    paddingLeft: 20,
    paddingRight: 20,
    borderColor: '#666',
    borderWidth: 1,
    borderRadius: 20,
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
