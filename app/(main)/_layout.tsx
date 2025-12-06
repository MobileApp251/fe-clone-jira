import { Stack } from "expo-router";
import { Text, View } from "react-native";

export default function Layout() {
    return (
        <View style={{ flex: 1 }}>
            <Text style={{ marginTop: 60, textAlign: "center" }}>Layout Header</Text>

            <Stack
                screenOptions={{
                    headerShown: false,
                }}
            />
        </View>
    );
}
