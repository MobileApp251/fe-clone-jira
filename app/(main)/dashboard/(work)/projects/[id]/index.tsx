import { useLocalSearchParams } from "expo-router";
import { View } from "lucide-react-native";

export default function ProjectDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    return (
        <View>Project Detail: {id}</View>
    )
}