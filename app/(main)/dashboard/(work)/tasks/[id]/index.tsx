import { useLocalSearchParams } from "expo-router";
import { View } from "lucide-react-native";

export default function TaskDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    return (
        <View>Task Detail: {id}</View>
    )
}