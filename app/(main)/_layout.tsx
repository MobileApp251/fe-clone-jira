import Header from "@/components/header/Header";
import { Stack } from "expo-router";
import { View } from "react-native";

export default function Layout() {
    return (
        <View className="bg-white flex-1">
            <Header />

            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: 'white' }
                }}
            />
        </View>
    );
}
