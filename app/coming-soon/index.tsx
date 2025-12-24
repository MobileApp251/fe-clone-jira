import { Button } from "@/components/ui/button";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { ChevronLeft } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";


export default function ComingSoon() {
    const router = useRouter();

    return (
        <View className="flex-1 bg-white items-center justify-center px-6">
            <LottieView
                source={require('../../assets/animations/register.json')}
                autoPlay
                loop
                style={{ width: 260, height: 260 }}
            />

            <Text className="text-3xl font-bold mt-4 text-lightPrimary">
                Coming Soon
            </Text>

            <Text className="text-center text-gray-500 mt-2 mb-8">
                Chức năng đang được phát triển. Vui lòng quay lại sau.
            </Text>

            <Button
                className="rounded-xl bg-lightPrimary"
                onPress={() => router.back()}
            >
                <ChevronLeft color='white'></ChevronLeft>
                <Text className="text-white font-semibold text-lg">
                    Back
                </Text>
            </Button>
        </View>
    );
}
