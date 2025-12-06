import Header from "@/components/header/Header";
import { Stack } from "expo-router";
import { View } from "react-native";

export default function Layout() {
    return (
        <View style={{ flex: 1 }} className="bg-white">
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
